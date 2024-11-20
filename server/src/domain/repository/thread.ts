import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { IThreadDto, IThreadFull } from "../interfaces/IThread";
import { ThreadTable } from "@/database/schema";
import { desc, eq, sql } from "drizzle-orm";
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
      const { title, content, attachment, createdBy } = dto;

      try {
        const insertResult = await this.db
          .insert(ThreadTable)
          .values({
            title,
            content,
            attachment,
            createdBy,
            communityId: null,
          })
          .$returningId();

        const threadId = insertResult[0].id;

        if (!threadId) {
          reject(new AppError("Error creating thread"));
          return;
        }

        const threadCreated = await this.findOneById(threadId);

        resolve(threadCreated);
      } catch (error: any) {
        let errorMessage = "Error inserting thread";
        let statusCode = 500;

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
          errorMessage =
            "Foreign key constraint violation: The 'createdBy' user does not exist.";
          statusCode = 500;
        }

        reject(new AppError(errorMessage, statusCode));
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
          },
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
