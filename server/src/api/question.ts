import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import QuestionService from "@/service/question";

export default {
    /**
     * Handler to create a new question.
     * 
     * @route POST /questions
     */
    async createQuestionHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const questionService = Container.get(QuestionService);
            const response = await questionService.createQuestion(dto);
            res.status(201).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve a question by its ID.
     * 
     * @route GET /questions/:questionId
     */
    async getQuestionByIdHandler(req: Request, res: Response, next: NextFunction) {
        const questionId = req.params.questionId;

        try {
            const questionService = Container.get(QuestionService);
            const response = await questionService.getQuestionById(questionId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve a question by its ID.
     * 
     * @route GET /questions/:questionId
     */
    async getAllQuestionsHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const questionService = Container.get(QuestionService);
            const response = await questionService.getAllQuestions();
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },


    /**
     * Handler to create a question request.
     * 
     * @route POST /questions/request
     */
    async createQuestionRequestHandler(req: Request, res: Response, next: NextFunction) {
        const dto = req.body;

        try {
            const questionService = Container.get(QuestionService);
            await questionService.createQuestionRequest(dto);
            res.status(201).json({ message: "Question request created successfully." });
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve all questions requested to a specific user.
     * 
     * @route GET /questions/requested/:userId
     */
    async getQuestionsRequestedToHandler(req: Request, res: Response, next: NextFunction) {
        const requestedToId = req.params.userId;

        try {
            const questionService = Container.get(QuestionService);
            const response = await questionService.getQuestionsRequestedTo(requestedToId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve all threads by question.
     * 
     * @route GET /questions/threads/:questionId
     */
    async getThreadsByQuestionHandler(req: Request, res: Response, next: NextFunction) {
        const questionId = req.params.questionId;

        try {
            const questionService = Container.get(QuestionService);
            const response = await questionService.getThreadsByQuestionId(questionId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve all users by question.
     * 
     * @route GET /questions/users/:questionId
     */
    async getUsersByQuestionHandler(req: Request, res: Response, next: NextFunction) {
        const questionId = req.params.questionId;

        try {
            const questionService = Container.get(QuestionService);
            const response = await questionService.getUsersByQuestion(questionId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },
};
