import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { IThreadDto, IThread } from "../interfaces/IThread";
import { ThreadTable, UserTable as user } from "@/database/schema";
import { eq } from "drizzle-orm";
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
   * @param {string} threadId - The ID of the thread to be retrieved.
   * @returns {Promise<IThread | undefined>} - A promise that resolves to the thread object if found, or undefined if not.
   * @throws {AppError} - Throws an AppError if the thread is not found or a database error occurs.
   */
  public async findOneById(threadId: string): Promise<IThread | undefined> {
    try {
      const result = await this.db.query.ThreadTable.findFirst({
        where: eq(ThreadTable.id, threadId),
        with: {
          user: true,
        },
      });

      if (!result) throw new AppError("Thread not found", 500);

      return this.threadTransformer(result);
    } catch (error: any) {
      throw new AppError(error.message || "Database error", 500);
    }
  }

  /**
   * Creates a new thread in the database.
   *
   * @param {IThreadDto} dto - The data transfer object containing the thread details.
   * @returns {Promise<IThread | undefined>} - A promise that resolves to the created thread object.
   * @throws {AppError} - Throws an AppError if there is an issue inserting the thread or if the 'createdBy' user does not exist.
   */
  public async create(dto: IThreadDto): Promise<IThread | undefined> {
    const { title, content, attachment, createdBy } = dto;

    try {
      // Insert the new thread into the database
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

      // After insert, query the thread data to retrieve the full record
      const threadId = insertResult[0].id;

      console.log("thread: ", threadId);

      const threadCreated = await this.db.query.ThreadTable.findFirst({
        where: eq(ThreadTable.id, threadId),
        with: {
          user: true,
        },
      });

      if (!threadCreated) throw new AppError("Thread not created", 500);

      return this.threadTransformer(threadCreated);
    } catch (error: any) {
      let errorMessage = "Error inserting thread";
      let statusCode = 500;

      // Handle specific database error for foreign key constraint violation
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        console.log("repo error");
        errorMessage =
          "Foreign key constraint violation: The 'createdBy' user does not exist.";
        statusCode = 500;
      }

      // Throw a new AppError with the proper message and status code
      throw new AppError(errorMessage, statusCode);
    }
  }
  
  /**
   * Transform raw thread into {IThread} 
   * 
   * TODO infer rawResult type
   * @param rawResult 
   * @returns {IThread}
   */
  private threadTransformer(rawResult: any): IThread {
    const { user, ...threadData } = rawResult;

    return {
      ...threadData,
      createdBy: user,
    } as unknown as IThread;
  } 
}

export default ThreadRepository;
