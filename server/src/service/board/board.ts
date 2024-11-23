import { IBoard, IBoardDto } from "@/domain/interfaces/IBoard";
import BoardRepository from "@/domain/repository/board";
import { AppError } from "@/libs/app-error";
import { Service, Inject } from "typedi";

@Service()
class BoardService {
    @Inject(() => BoardRepository)
    private boardRepo!: BoardRepository;

    /**
     * Creates a new board.
     * 
     * @param dto
     * @returns {Promise<IBoard | undefined>}
     */
    public async createBoard(dto: IBoardDto): Promise<IBoard | undefined> {
        try {
            return this.boardRepo.create(dto);
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
}

export default BoardService;
