import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Inject, Service } from "typedi";
import * as schema from "@/database/schema";
import { BoardTable } from "@/database/schema";
import { BoardMembersTable } from "@/database/schema";
import { IBoard, IBoardDto, IBoardMember, IBoardMemberDto } from "../interfaces/IBoard";
import { eq } from "drizzle-orm";
import { AppError } from "@/libs/app-error";
import { IUser } from "../interfaces/IUser";
import UserRepository from "./user";

@Service()
class BoardRepository {
    private db: MySql2Database<typeof schema>;

    @Inject(() => UserRepository)
    private userRepo!: UserRepository;

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

    /**
     * Adds a new member to a board.
     *
     * @param {IBoardMemberDto} dto 
     * @returns {Promise<IBoardMember>}
     */
    public addMember(dto: IBoardMemberDto): Promise<IBoardMember> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(BoardMembersTable)
                    .values({...dto})
                    .$returningId();

                const resultId = result[0].id;

                const boardMember = await this.db
                    .query 
                    .BoardMembersTable
                    .findFirst({
                        columns: {},
                        with: {
                            member: true,
                            board: {
                                with: {
                                    createdBy: true
                                }
                            }
                        },
                        where: eq(BoardMembersTable.id, resultId)
                    })

                resolve(boardMember as unknown as IBoardMember);
            } catch (error: any) {
                reject(new AppError(error));
            }
        })
    }

    public getMembers(boardId: string): Promise<IUser[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.BoardMembersTable.findMany({
                    where: eq(BoardMembersTable.boardId, boardId),
                    columns: {},
                    with: {
                        member: true
                    },
                });

                resolve(result.map(res => res.member) as unknown as IUser[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    public getSharedBoards(userId: string): Promise<IBoard[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.BoardMembersTable.findMany({
                    where: eq(BoardMembersTable.memberId, userId),
                    columns: {},
                    with: {
                        board: {
                            with: {
                                createdBy: true
                            }
                        }
                    },
                });

                resolve(result.map(res => res.board) as unknown as IBoard[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default BoardRepository;
