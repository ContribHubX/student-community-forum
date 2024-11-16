import { MySql2Database, } from "drizzle-orm/mysql2";
import { Service, Container } from "typedi";
import * as schema from "@/database/schema";
import { IThreadReaction, IThreadReactionDto } from "../interfaces/IThread";
import { AppError } from "@/libs/app-error";
import { eq, sql } from "drizzle-orm";
import { IComment, ICommentDto } from "../interfaces/IComment";
import { IUser } from "../interfaces/IUser";
import thread from "@/api/thread";

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
     * @returns {IThreadReaction | undefined}
     */
    public async react(dto: IThreadReactionDto): Promise<IThreadReaction | undefined> {
        try {
            const result = await this.db
                .insert(schema.ThreadReaction)
                .values({...dto})
                .$returningId();

            const reactionId = result[0].id;
            
            if (!reactionId) throw new AppError("Thread reaction not created", 500);
            
            const createdReaction = await this.db
                .query
                .ThreadReaction
                .findFirst({
                    where: eq(schema.ThreadReaction.id, reactionId)
                });

            return createdReaction as IThreadReaction;
        } catch (error: any) {
            throw new AppError(error.messsage, 500);
        }
    }
    
    /**
     * Creates thread comment
     * 
     * @param dto 
     * @returns {IComment | undefined}
     */
    public async comment(dto: ICommentDto): Promise<IComment | undefined> {
        try {
            const result = await this.db
                .insert(schema.CommentTable)
                .values({...dto})
                .$returningId();

            const insertedId = result[0].id;

            if (!insertedId) throw new AppError("Comment not created", 500);
            
            const createdComment = await this.db
                .query
                .CommentTable
                .findFirst({
                    where: eq(schema.CommentTable.id, insertedId),
                    with: {
                        createdBy: true
                    }
                });

            return createdComment as unknown as IComment;
        } catch(error: any) {
            throw new AppError(error.messsage, 500);
        }
    } 


    // TODO fix replies
    /**
     * Get's specific thread comments
     * 
     * @param threadId
     * @returns {Promise<IComment[] | undefined>}
     */
    public async getAll(threadId: string): Promise<IComment[] | undefined> {
        try {
            const topLevelComments = await this.db
                .query
                .CommentTable
                .findMany({
                    where: eq(schema.CommentTable.threadId, threadId),
                });

            // attach replies on each comment
            for(const comment of topLevelComments) {
                const replies = await this.db
                    .query
                    .CommentTable
                    .findMany({
                        where: eq(schema.CommentTable.parentId, comment.id)
                    });

                (comment as any).replies = replies
            }

            return topLevelComments as unknown as IComment[];
        } catch(error:any) {
            throw new AppError(error.messsage, 500);
        }
    }

    /**
     * Get's user details base on threadId
     * 
     * @param threadId
     * @returns {Promise<IUser>}
     */
    public async getUserByThreadId(threadId: string): Promise<IUser> {
        try {
            const result = await this.db
                .query
                .ThreadTable 
                .findFirst({
                    where: eq(schema.ThreadTable.id, threadId),
                    with: { user: true }
                })
            
            if (!result?.user) 
                throw new AppError("Invalid user", 500);

            return result.user
        } catch(error: any) {
            throw new AppError(error.messsage, 500);
        }
    } 

    /**
     * Transform raw comment into {IComment 
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