import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import BoardService from "@/service/board";

export default {
    /**
     * Handler to create a new board.
     * 
     * @route POST /boards
     */
    async createBoardHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const boardService = Container.get(BoardService);
            const response = await boardService.createBoard(dto);
            res.status(201).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve a board by its ID.
     * 
     * @route GET /boards/:boardId
     */
    async getBoardByIdHandler(req: Request, res: Response, next: NextFunction) {
        const boardId = req.params.boardId;

        try {
            const boardService = Container.get(BoardService);
            const response = await boardService.getBoardById(boardId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve all boards created by a user.
     * 
     * @route GET /boards
     */
    async getAllBoardsHandler(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.userId as string;

        try {
            const boardService = Container.get(BoardService);
            const response = await boardService.getAllBoards(userId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    }
};
