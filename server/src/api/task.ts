import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import TaskService from "@/service/task";

// TODO revise task creation/update to accept form data 

export default {
    /**
     * Handler to create a new task.
     * 
     * @route POST /tasks
     */
    async createTaskHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body; 
        const file = req.file;

        try {
            if (file) {
                dto.attachment = file.path;
            }

            if (dto.assignees) {
                dto.assignees = JSON.parse(dto.assignees);
            }

            const taskService = Container.get(TaskService);
            const response = await taskService.createTask(dto);
            res.status(201).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve a task by its ID.
     * 
     * @route GET /tasks/:taskId
     */
    async getTaskByIdHandler(req: Request, res: Response, next: NextFunction) {
        const taskId = req.params.taskId;

        try {
            const taskService = Container.get(TaskService);
            const response = await taskService.getTaskById(taskId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve all tasks for a specific board.
     * 
     * @route GET /tasks
     */
    async getAllTasksHandler(req: Request, res: Response, next: NextFunction) {
        const boardId = req.query.boardId as string;

        try {
            const taskService = Container.get(TaskService);
            const response = await taskService.getAllTasks(boardId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to update a task.
     * 
     * @route PUT /tasks/:taskId
     */
    async updateTaskHandler(req: Request, res: Response, next: NextFunction) {
        const taskId = req.params.taskId;
        const dto = { ...req.body, taskId };
        const file = req.file;
    
        try {
            if (dto.assignees && typeof dto.assignees === "string" ) {
                const parsedAssignees = JSON.parse(dto.assignees);
                dto.assignees = parsedAssignees;
            }

            if (file) {
                dto.attachment = file.path;
            }

            const taskService = Container.get(TaskService);
            const response = await taskService.updateTask(dto);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to delete task for a specific board.
     * 
     * @route DELETE /task/:taskId
     */
     async deleteTasksHandler(req: Request, res: Response, next: NextFunction) {
        const taskId = req.params.taskId as string;

        try {
            const taskService = Container.get(TaskService);
            const response = await taskService.deleteTask(taskId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },
};
