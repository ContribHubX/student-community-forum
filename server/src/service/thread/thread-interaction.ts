import { IComment, ICommentDto } from "@/domain/interfaces/IComment";
import { IThreadReaction, IThreadReactionDto } from "@/domain/interfaces/IThread";
import ThreadInteractionRepository from "@/domain/repository/thread-interaction";
import { AppError } from "@/libs/app-error";
import EventManager from "@/sockets/event-manager";
import { Inject, Service } from "typedi";

@Service()
class ThreadInteractionService {
    @Inject(() => ThreadInteractionRepository)
    private threadInteractionRepo!: ThreadInteractionRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    /**
     * Adds a reaction (like or dislike) to a thread.
     *
     * @param {IThreadReactionDto} dto - DTO containing thread ID, user ID, and reaction type.
     * @returns {Promise<IThreadReaction | undefined>} - Created thread reaction object or undefined if an error occurs.
     * @throws {AppError} - Error if adding the reaction fails.
     */
    public async reactToThread(dto: IThreadReactionDto): Promise<IThreadReaction | undefined> {
        try {
            const result = await this.threadInteractionRepo.react(dto);
            return result;
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError("Create thread error");
        }
    }

    /**
     * Adds a comment to a thread
     * 
     * @param dto 
     * @returns Promise<IComment | undefined> - Created thread reaction object or undefined if an error occurs.
     * @throws {AppError} 
     */
    public async createComment(dto: ICommentDto): Promise<IComment | undefined> {
        try {
            const result = await this.threadInteractionRepo.comment(dto);
            this.eventManager.publish<IComment>("comment--new", result);
            return result;
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError("Create thread error");
        }
    }
}

export default ThreadInteractionService;