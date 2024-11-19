import { MySql2Database } from "drizzle-orm/mysql2";
import { Service, Container } from "typedi";
import * as schema from "@/database/schema";
import { IAlreadyReactedDto, IThreadReaction, IThreadReactionDto } from "../interfaces/IThread";
import { AppError } from "@/libs/app-error";
import { and, desc, eq } from "drizzle-orm";
import { IComment, ICommentDto } from "../interfaces/IComment";
import { IUser } from "../interfaces/IUser";
import { ThreadReactionType } from "@/types";

@Service()
class ThreadInteractionRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
      this.db = Container.get("database");
    }

    /**
     * Creates thread reaction
     * 
     * @param dto 
     * @returns {Promise<IThreadReaction | undefined>}
     */
    public react(dto: IThreadReactionDto): Promise<IThreadReaction | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                // check first if the user already reacted to this thread
                const isAlreadyReacted = await this.isReacted({ userId: dto.userId, threadId: dto.threadId });

                if (isAlreadyReacted) return reject(new AppError("User has already reacted to this thread.", 409));

                const result = await this.db
                    .insert(schema.ThreadReaction)
                    .values({...dto})
                    .$returningId();

                const reactionId = result[0].id;

                if (!reactionId) throw new AppError("Thread reaction not created");

                const createdReaction = await this.db
                    .query
                    .ThreadReaction
                    .findFirst({
                        where: eq(schema.ThreadReaction.id, reactionId)
                    });

                resolve(createdReaction as IThreadReaction);
            } catch (error: any) {
                reject(error);
            }
        });
    }

    /**
     * Creates thread comment
     * 
     * @param dto 
     * @returns {Promise<IComment | undefined>}
     */
    public comment(dto: ICommentDto): Promise<IComment | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(schema.CommentTable)
                    .values({...dto})
                    .$returningId();

                const insertedId = result[0].id;

                if (!insertedId) return reject(new AppError("Comment not created"));

                const createdComment = await this.db
                    .query
                    .CommentTable
                    .findFirst({
                        where: eq(schema.CommentTable.id, insertedId),
                        with: {
                            createdBy: true
                        }
                    });

                resolve(createdComment as unknown as IComment);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Gets specific thread comments
     * 
     * @param threadId
     * @returns {Promise<IComment[] | undefined>}
     */
    public getAll(threadId: string): Promise<IComment[] | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const topLevelComments = await this.db
                    .query
                    .CommentTable
                    .findMany({
                        where: eq(schema.CommentTable.threadId, threadId),
                        with: { createdBy: true },
                        orderBy: [desc(schema.CommentTable.createdAt)],
                    });

                // attach replies on each comment
                for (const comment of topLevelComments) {
                    const replies = await this.db
                        .query
                        .CommentTable
                        .findMany({
                            where: eq(schema.CommentTable.parentId, comment.id),
                            with: { createdBy: true }
                        });

                    (comment as any).replies = replies;
                }

                resolve(topLevelComments as unknown as IComment[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Gets user details based on threadId
     * 
     * @param threadId
     * @returns {Promise<IUser>}
     */
    public getUserByThreadId(threadId: string): Promise<IUser> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .query
                    .ThreadTable
                    .findFirst({
                        where: eq(schema.ThreadTable.id, threadId),
                        with: { user: true }
                    });

                if (!result?.user) return reject(new AppError("User not found", 404));

                resolve(result.user);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    
    /**
     * Check if user already reacted
     * 
     * @param dto {}
     * @returns {Promise<boolean>}
     */
    public isReacted(dto: IAlreadyReactedDto): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                // check first if the user already reacted to this thread
                const isAlreadyReacted = await this.db
                    .query
                    .ThreadReaction
                    .findFirst({
                        columns: {
                            id: true
                        },
                        where: and(
                            eq(schema.ThreadReaction.userId, dto.userId),
                            eq(schema.ThreadReaction.threadId, dto.threadId)
                        )
                    });

                resolve(isAlreadyReacted  ? true : false);
               
            } catch (error: any) {
                reject(error);
            }
        });
    }

    /**
     * Get user reaction
     * 
     * @param dto {}
     * @returns {Promise<ThreadReactionType>}
     */
    public getReaction(dto: IAlreadyReactedDto): Promise<ThreadReactionType> {
        return new Promise(async (resolve, reject) => {
            try {
                // check first if the user already reacted to this thread
                const isAlreadyReacted = await this.db
                    .query
                    .ThreadReaction
                    .findFirst({
                        columns: {
                            type: true 
                        },
                        where: and(
                            eq(schema.ThreadReaction.userId, dto.userId),
                            eq(schema.ThreadReaction.threadId, dto.threadId)
                        )
                    });

                resolve(isAlreadyReacted as unknown as ThreadReactionType);
               
            } catch (error: any) {
                reject(error);
            }
        });
    }

    /**
     * Transform raw comment into IComment 
     * 
     * TODO infer rawResult type
     * @param rawResult 
     * @returns {IComment}
     */
    private commentTransformer(rawResult: any): IComment {
        const { user, ...commentData } = rawResult;

        return {
            ...commentData,
            createdBy: user,
        } as unknown as IComment;
    }
}

export default ThreadInteractionRepository;
