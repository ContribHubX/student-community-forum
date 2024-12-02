import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import StudyRoomService from "@/service/study-room";

export default {
    /**
     * Handler to create a new study room.
     * 
     * @route POST /study-rooms
     */
    async createRoomHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.createRoom(dto);
            res.status(201).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to retrieve all study rooms.
     * 
     * @route GET /study-rooms
     */
    async getAllRoomsHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.getAllRoom();
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to retrieve a study rooms.
     * 
     * @route GET /study-rooms
     */
    async getRoomByIdHandler(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.roomId as string;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.getRoomById(roomId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to create a new chat message in a study room.
     * 
     * @route POST /study-rooms/chats
     */
    async createChatHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.createChat(dto);
            res.status(201).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to get all chat messages for a specific study room.
     * 
     * @route GET /study-rooms/:roomId/chats
     */
    async getAllChatsHandler(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.roomId;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.getAllChats(roomId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to create a new task in a study room.
     * 
     * @route POST /study-rooms/tasks
     */
    async createTodoHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.createTodo(dto);
            res.status(201).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to update an existing task in a study room.
     * 
     * @route PUT /study-rooms/tasks
     */
    async updateTodoHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.updateTodo(dto);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    },

    /**
     * Handler to get all tasks for a specific board in a study room.
     * 
     * @route GET /study-rooms/:boardId/tasks
     */
    async getAllTodosHandler(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.userId as string;

        try {
            const studyRoomService = Container.get(StudyRoomService);
            const response = await studyRoomService.getAllTodos(userId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error.message));
        }
    }
};
