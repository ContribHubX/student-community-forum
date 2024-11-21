import { IComment, ICommentDto } from "@/domain/interfaces/IComment";
import {
  IAlreadyReactedDto,
  IThreadReaction,
  IThreadReactionDto,
} from "@/domain/interfaces/IThread";
import ThreadInteractionRepository from "@/domain/repository/thread-interaction";
import { AppError } from "@/libs/app-error";
import EventManager from "@/sockets/event-manager";
import { Inject, Service } from "typedi";
import NotificationService from "../notification";
import { NotificationType, ThreadReactionType } from "@/types";

// TODO get user id  base on thread id

@Service()
class ThreadInteractionService {
  @Inject(() => ThreadInteractionRepository)
  private threadInteractionRepo!: ThreadInteractionRepository;

  @Inject(() => NotificationService)
  private notifService!: NotificationService;

  @Inject(() => EventManager)
  private eventManager!: EventManager;

  /**
   * Adds a reaction (like or dislike) to a thread.
   *
   * @param {IThreadReactionDto} dto - DTO containing thread ID, user ID, and reaction type.
   * @returns {Promise<IThreadReaction | undefined>} - Created thread reaction object or undefined if an error occurs.
   * @throws {AppError} - Error if adding the reaction fails.
   */
  public async reactToThread(
    dto: IThreadReactionDto,
  ): Promise<IThreadReaction | undefined> {

    try {
      const result = await this.threadInteractionRepo.react(dto);
      this.eventManager.publishToMany<IThreadReaction>(
        `${dto.type.toLowerCase()}--new`,
        result,
      );

      if (!result) throw new AppError("Invalid reaction");

      // notify user who created the thread
      const user = await this.threadInteractionRepo.getUserByThreadId(
        dto.threadId,
      );
      await this.notifService.createNotification({
        entityId: dto.threadId,
        entityType: "thread",
        type: dto.type.toLowerCase() as NotificationType,
        createdBy: dto.userId,
        receiveBy: user.id,
      });

      return result;
    } catch (error: any) {
      if (error instanceof AppError)throw error; 
      throw new AppError("React to thread error");
    }
  }
  
  /**
   * Adds a comment to a thread
   *
   * @param dto
   * @returns {Promise<IComment | undefined>} - Created thread reaction object or undefined if an error occurs.
   * @throws {AppError}
   */
  public async createComment(dto: ICommentDto): Promise<IComment | undefined> {
    try {
      const result = await this.threadInteractionRepo.comment(dto);
      this.eventManager.publishToMany<IComment>("comment--new", result);

      // notify user who created the thread
      const user = await this.threadInteractionRepo.getUserByThreadId(
        dto.threadId,
      );
      await this.notifService.createNotification({
        entityId: dto.threadId,
        entityType: "thread",
        type: "comment" as NotificationType,
        createdBy: dto.createdBy,
        receiveBy: user.id,
      });

      return result;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error);
    }
  }

  /**
   * Check if user already reacted
   *
   * @param dto
   * @returns {ThreadReactionType} - Created thread reaction object or undefined if an error occurs.
   * @throws {AppError}
   */
  public async getUserReaction(dto: IAlreadyReactedDto): Promise<ThreadReactionType> {
    try {
      const reaction = await this.threadInteractionRepo.getReaction(dto);
      return reaction ? reaction : "NONE"
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error fetching comments");
    }
  }

  /**
   * Fetches comments in specific a thread
   *
   * @param threadId
   * @returns {Promise<IComment[] | undefined>} - Created thread reaction object or undefined if an error occurs.
   * @throws {AppError}
   */
  public async getComments(threadId: string): Promise<IComment[] | undefined> {
    try {
      return this.threadInteractionRepo.getAll(threadId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error fetching comments");
    }
  }
}

export default ThreadInteractionService;
