import { IBoard, IBoardDto, IBoardMember, IBoardMemberDto } from "@/domain/interfaces/IBoard";
import { IUser } from "@/domain/interfaces/IUser";
import BoardRepository from "@/domain/repository/board";
import { AppError } from "@/libs/app-error";
import EventManager from "@/sockets/event-manager";
import { Service, Inject } from "typedi";

@Service()
class BoardService {
    @Inject(() => BoardRepository)
    private boardRepo!: BoardRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    /**
     * Creates a new board.
     * 
     * @param dto
     * @returns {Promise<IBoard | undefined>}
     */
    public async createBoard(dto: IBoardDto): Promise<IBoard | undefined> {
        try {
            const result = await this.boardRepo.create(dto);
            this.eventManager.publishToOne<IBoard>("board--new", result, result.createdBy.id);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Gets board details by ID.
     * 
     * @param boardId
     * @returns {Promise<IBoard | undefined>}
     */
    public async getBoardById(boardId: string): Promise<IBoard | undefined> {
        try {
            return this.boardRepo.getById(boardId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Gets all boards created by a specific user.
     * 
     * @param userId
     * @returns {Promise<IBoard[]>}
     */
    public async getAllBoards(userId: string): Promise<IBoard[]> {
        try {
            return this.boardRepo.getAll(userId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Adds a new member to a board.
     *
     * @param {IBoardMemberDto} dto 
     * @returns {Promise<IBoardMember>}
     */
    public async addBoardMember(dto: IBoardMemberDto): Promise<IBoardMember> {
        try {
            return this.boardRepo.addMember(dto );
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    public async getBoardMembers(boardId: string): Promise<IUser[]> {
        try {
            return this.boardRepo.getMembers(boardId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    public async getSharedBoards(userId: string): Promise<IBoard[]> {
        try {
            return this.boardRepo.getSharedBoards(userId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

}

export default BoardService;