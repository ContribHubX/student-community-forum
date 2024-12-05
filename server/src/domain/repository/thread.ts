import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { IThreadDto, IThreadFull, IThreadUpdateDto } from "../interfaces/IThread";
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
  public findOneById(threadId: string): Promise<IThreadFull | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findFirst({
          where: eq(ThreadTable.id, threadId),
          extras: {
            ...this.threadReactionExtras(),
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
            communityId: dto.communityId === "" ? null : dto.communityId 
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

        const threadCreated = await this.findOneById(threadId);

        resolve(threadCreated);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }   

  public update(dto: IThreadUpdateDto): Promise<IThreadFull | undefined> {
    console.log(dto.tags)
    return new Promise(async (resolve, reject) => {
      try {
        const thread = await this.findOneById(dto.threadId);
        
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

        const threadCreated = await this.findOneById(dto.threadId);

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
  public getAll(): Promise<IThreadFull[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findMany({
          extras: {
            ...this.threadReactionExtras(),
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
  public getAllByTopic(topicId: string): Promise<IThreadFull[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db.query.ThreadTable.findMany({
          extras: {
            ...this.threadReactionExtras(),
          },
          with: {
            createdBy: true,
          },
          where: eq(ThreadTable.topicId, topicId),
          orderBy: [desc(ThreadTable.createdAt)],
        });

        resolve(result as unknown as IThreadFull[]);
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
  private threadReactionExtras() {
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
    };
  }
}

export default ThreadRepository;
