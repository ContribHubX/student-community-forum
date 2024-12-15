import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { IGetByCommunityDto, IGetByIdDto, IGetByTopicDto, ISaveThreadDto, IThreadDeleteDto, IThreadDto, IThreadFull, IThreadUpdateDto } from "../interfaces/IThread";
import { ThreadTable, ThreadTagsTable } from "@/database/schema";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { AppError } from "@/libs/app-error";
import * as schema from "@/database/schema";

@Service()
class ThreadRepository {
  private db: MySql2Database<typeof schema>;

  constructor() {
    this.db = Container.get("database");
  }

  /**
   * Finds a thread by its ID.
   * 
   * @param {string} threadId - The ID of the thread to find.
   * @returns {Promise<IThreadFull | undefined>} The thread data or `undefined` if not found.
   * @throws {AppError} If the thread is not found or a database error occurs.
   */
  public findOneById(dto: IGetByIdDto): Promise<IThreadFull | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findFirst({
          where: eq(ThreadTable.id, dto.threadId),
          extras: {
            ...this.threadReactionExtras(dto.userId),
          },
          with: {
            createdBy: true,
            tags: true
          },
        });

        if (!result) {
          reject(new AppError("Thread not found", 404));
          return;
        }

        resolve(result as unknown as IThreadFull);
      } catch (error: any) {
        reject(new AppError(error || "Database error"));
      }
    });
  }

  /**
   * Creates a new thread in the database.
   * 
   * @param {IThreadDto} dto - The data transfer object containing thread details.
   * @returns {Promise<IThreadFull | undefined>} The created thread.
   * @throws {AppError} If an error occurs during thread creation or if constraints are violated.
   */
  public create(dto: IThreadDto): Promise<IThreadFull | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const insertResult = await this.db  
          .insert(ThreadTable)
          .values({
            ...dto,
            communityId: dto.communityId === "" ? null : dto.communityId,
            topicId: dto.topicId === "" || !dto.topicId ? null : dto.topicId 
          })
          .$returningId();

        const threadId = insertResult[0].id;

        if (!threadId) {
          reject(new AppError("Error creating thread"));
          return;
        }

        // Insert tags if present
        if (dto.tags && dto.tags.length > 0) {
          await Promise.all(
            dto.tags.map((tag) =>
              this.db.insert(ThreadTagsTable).values({
                name: (tag as any),
                threadId
              })
            )
          );
        }

        const threadCreated = await this.findOneById({userId: dto.createdBy, threadId: threadId});

        resolve(threadCreated);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }   

  public update(dto: IThreadUpdateDto): Promise<IThreadFull | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const thread = await this.findOneById({userId: dto.createdBy, threadId: dto.threadId});
        
        // check first if thread exist
        if (!thread) 
          return reject(new AppError("Thread doesn't exist", 400));
        

        // check if he/she is the owner
        if (thread.createdBy.id !== dto.createdBy) 
          return reject(new AppError("Only owner can edit the thread", 400));
        
        // update row
        const updateResult = await this.db
          .update(ThreadTable)
          .set({
            ...dto,
            communityId: dto.communityId === "" ? null : dto.communityId 
          })
          .where(eq(ThreadTable.id, dto.threadId));

        if (!updateResult) 
          return reject(new AppError("Error updating thread", 500));

        // Update tags if present
        if (dto.tags && dto.tags.length > 0) {

          // clear tags first
          await this.db
            .delete(ThreadTagsTable)
            .where(eq(ThreadTagsTable.threadId, dto.threadId));

          await Promise.all(
            dto.tags.map((tag) =>
              this.db.
                insert(ThreadTagsTable)
                .values({
                  name: (tag as any),
                  threadId: dto.threadId
                })
            )
          );
        }

        const threadCreated = await this.findOneById({userId: dto.createdBy, threadId: dto.threadId});

        resolve(threadCreated);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }   

  /**
   * Fetches all threads from the database.
   * 
   * @returns {Promise<IThreadFull[]>} A list of all threads.
   * @throws {AppError} If a database error occurs.
   */
  public getAll(userId: string): Promise<IThreadFull[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findMany({
          extras: {
            ...this.threadReactionExtras(userId),
          },
          with: {
            createdBy: true,
            tags: true
          },
          where: and(
            // isNull(ThreadTable.communityId),
            isNull(ThreadTable.topicId),
            isNull(ThreadTable.questionId)
          ),
          orderBy: [desc(ThreadTable.createdAt)],
        });

        resolve(result as unknown as IThreadFull[]);
      } catch (error: any) {
        reject(new AppError(error || "Database error"));
      }
    });
  }

  /**
   * Fetches all threads by topic from the database.
   * 
   * @returns {Promise<IThreadFull[]>} A list of all threads.
   * @throws {AppError} If a database error occurs.
   */
  public getAllByTopic(dto: IGetByTopicDto): Promise<IThreadFull[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findMany({
          extras: {
            ...this.threadReactionExtras(dto.userId),
          },
          with: {
            createdBy: true,
          },
          where: eq(ThreadTable.topicId, dto.topicId),
          orderBy: [desc(ThreadTable.createdAt)],
        });

        resolve(result as unknown as IThreadFull[]);
      } catch (error: any) {
        reject(new AppError(error || "Database error"));
      }
    });
  }

  /**
   * Fetches all threads by topic from the database.
   * 
   * @returns {Promise<IThreadFull[]>} A list of all threads.
   * @throws {AppError} If a database error occurs.
   */
  public getAllByCommunity(dto: IGetByCommunityDto): Promise<IThreadFull[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findMany({
          extras: {
            ...this.threadReactionExtras(dto.userId),
          },
          with: {
            createdBy: true,
          },
          where: eq(ThreadTable.communityId, dto.communityId),
          orderBy: [desc(ThreadTable.createdAt)],
        });

        resolve(result as unknown as IThreadFull[]);
      } catch (error: any) {
        reject(new AppError(error || "Database error"));
      }
    });
  }

  public delete(dto: IThreadDeleteDto): Promise<IThreadFull> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if thread exist
        const thread = await this.findOneById({userId: dto.userId, threadId: dto.threadId});

        if (!thread) return reject(new AppError("Thread not found", 404));

        // check if owner
        if (thread.createdBy.id !== dto.userId) return reject(new AppError("Must be owner of the thread", 400));

        await this.db
          .delete(ThreadTable)
          .where(eq(ThreadTable.id, dto.threadId));

        resolve(thread);
      } catch (error: any) {
        reject(new AppError(error || "Database error"));
      }
    });
  }

  public save(dto: ISaveThreadDto): Promise<ISaveThreadDto> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if thread exist
        const thread = await this.findOneById({userId: dto.userId, threadId: dto.threadId});

        if (!thread) return reject(new AppError("Thread not found", 404));

        // check if already saved 
        const isSaved = await this.db
          .query
          .SavedThreadTable
          .findFirst({
            where: and(
              eq(schema.SavedThreadTable.userId, dto.userId),
              eq(schema.SavedThreadTable.threadId, dto.threadId)
            )
          })


        if (isSaved) return reject(new AppError("Already saved", 400));

        await this.db
          .insert(schema.SavedThreadTable)
          .values({...dto});

        resolve(dto);
      } catch (error: any) {
        reject(new AppError(error || "Database error"));
      }
    });
  }
 
  /**
   * Generates additional SQL columns for reaction and comment counts.
   * 
   * @private
   * @returns {Object} An object containing SQL expressions for like, dislike, and comment counts.
   */
  private threadReactionExtras(userId: string) {
    return {
      likeCount: sql<number>`(
        SELECT COUNT(*) FROM thread_reaction 
        WHERE thread_reaction.thread_id = ${ThreadTable.id} 
        AND thread_reaction.type = 'LIKE'
      )`.as("like_count"),
      dislikeCount: sql<number>`(
        SELECT COUNT(*) FROM thread_reaction 
        WHERE thread_reaction.thread_id = ${ThreadTable.id} 
        AND thread_reaction.type = 'DISLIKE'
      )`.as("dislike_count"),
      commentCount: sql<number>`(
        SELECT COUNT(*) FROM comment
        WHERE thread_id = ${ThreadTable.id} 
      )`.as("comment_count"),
      isSaved: sql<boolean>`(
        SELECT EXISTS (
            SELECT 1 
            FROM saved_thread
            WHERE saved_thread.thread_id = ${ThreadTable.id} 
              AND saved_thread.user_id = ${userId}
        )
      )`.as("is_saved"),
    };
  }
}

export default ThreadRepository;
