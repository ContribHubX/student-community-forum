import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { BoardTable } from "@/database/schema";
import { IBoard, IBoardDto } from "../interfaces/IBoard";
import { eq } from "drizzle-orm";
import { AppError } from "@/libs/app-error";

@Service()
class BoardRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new board and returns the created board.
     * 
     * @param IBoardDto
     * @returns {Promise<IBoard>}
     */
    public async create(dto: IBoardDto): Promise<IBoard> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(BoardTable)
                    .values({ ...dto })
                    .$returningId();

                const boardId = result[0].id;
                const board = await this.getById(boardId);

                resolve(board as IBoard);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves a board by its ID.
     * 
     * @param boardId
     * @returns {Promise<IBoard | undefined>}
     */
    public getById(boardId: string): Promise<IBoard | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.BoardTable.findFirst({
                    where: eq(BoardTable.id, boardId),
                    with: {
                        createdBy: true,
                        members: {
                            with: {
                                member: true,
                            },
                        },
                    },
                });

                if (!result) {
                    return reject(new AppError("Board not found", 404));
                }

                resolve(result as unknown as IBoard);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves all boards created by a specific user.
     * 
     * @param userId
     * @returns {Promise<IBoard[]>}
     */
    public getAll(userId: string): Promise<IBoard[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.BoardTable.findMany({
                    where: eq(BoardTable.createdBy, userId),
                    with: {
                        createdBy: true,
                        members: {
                            with: {
                                member: true,
                            },
                        },
                    },
                });

                resolve(result as unknown as IBoard[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default BoardRepository;
