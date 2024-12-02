import { IThreadFull, IThreadDto, IThreadUpdateDto } from "@/domain/interfaces/IThread";
import ThreadRepository from "@/domain/repository/thread";
import { AppError } from "@/libs/app-error";
import { Inject, Service } from "typedi";
import EventManager from "@/pubsub/event-manager";

/**
 * Service responsible for handling thread-related operations.
 */
@Service()
class ThreadService {
  @Inject(() => ThreadRepository)
  private threadRepo!: ThreadRepository;

  @Inject(() => EventManager)
  private eventManager!: EventManager;  

    
  /**
   * Creates a new thread.
   *
   * @param {IThreadDto} dto - The data transfer object containing the information to create a thread.
   * @returns {Promise<IThreadFull | undefined>} - The created thread object or undefined if an error occurs.
   * @throws {AppError} - Throws an error if the thread creation fails.
   */
  public async createThread(dto: IThreadDto): Promise<IThreadFull | undefined> {
    try {
      const thread = await this.threadRepo.create(dto);
      this.eventManager.publishToMany<IThreadFull>("thread--new", thread);
      return thread;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Create thread error");
    }
  }

  /**
   * 
   * @param dto 
   * @returns 
   */
  public async updateThread(dto: IThreadUpdateDto): Promise<IThreadFull | undefined> {
    try {
      const thread = await this.threadRepo.update(dto);
      // this.eventManager.publishToMany<IThreadFull>("thread--new", thread);
      return thread;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Update thread error");
    }
  }

  /**
   * Retrieves a thread by its ID.
   *
   * @param {string} threadId - The unique identifier of the thread to retrieve.
   * @returns {Promise<IThreadFull | undefined>} - The thread object with the given ID or undefined if not found.
   * @throws {AppError} - Throws an error if the retrieval of the thread fails.
   */
  public async getThreadById(threadId: string): Promise<IThreadFull | undefined> {
    try {
      return await this.threadRepo.findOneById(threadId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error getting thread");
    }
  }

  /**
   * 
   * @returns 
   */
  public async getAllThread(): Promise<IThreadFull[] | undefined> {
    try {
       return await this.threadRepo.getAll();
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error getting threads");
    }
    
  }

  /**
   * 
   * @returns 
   */
  public async getAllThreadByTopic(topicId: string): Promise<IThreadFull[] | undefined> {
    try {
       return await this.threadRepo.getAllByTopic(topicId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error getting threads");
    }
    
  }
}

export default ThreadService;
