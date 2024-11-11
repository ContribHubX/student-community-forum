import { IThread, IThreadDto } from "@/domain/interfaces/IThread";
import ThreadRepository from "@/domain/repository/thread";
import { AppError } from "@/libs/app-error";
import { Inject, Service } from "typedi";

/**
 * Service responsible for handling thread-related operations.
 */
@Service()
class ThreadService {
  @Inject(() => ThreadRepository)
  private threadRepo!: ThreadRepository;

  /**
   * Creates a new thread.
   *
   * @param {IThreadDto} dto - The data transfer object containing the information to create a thread.
   * @returns {Promise<IThread | undefined>} - The created thread object or undefined if an error occurs.
   * @throws {AppError} - Throws an error if the thread creation fails.
   */
  public async createThread(dto: IThreadDto): Promise<IThread | undefined> {
    try {
      return await this.threadRepo.create(dto);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Create thread error");
    }
  }

  /**
   * Retrieves a thread by its ID.
   *
   * @param {string} threadId - The unique identifier of the thread to retrieve.
   * @returns {Promise<IThread | undefined>} - The thread object with the given ID or undefined if not found.
   * @throws {AppError} - Throws an error if the retrieval of the thread fails.
   */
  public async getThreadById(threadId: string): Promise<IThread | undefined> {
    try {
      return await this.threadRepo.findOneById(threadId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error getting thread");
    }
  }
}

export default ThreadService;
