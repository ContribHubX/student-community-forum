import { Request, Response, NextFunction } from "express";
import { AppError } from "@/libs/app-error";
import Container from "typedi";
import ThreadService from "@/service/thread/thread";

/**
 * Controller for handling thread-related HTTP requests.
 *
 */
export default {
  /**
   * Handler to create a new thread.
   *
   * @route POST /thread/create
   */
  async createThreadHandler(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const file = req.file;

    try {
      if (file) 
        body.attachment = file.path;
      
      if (body.tags) 
        body.tags = JSON.parse(body.tags);
      

      const threadService = Container.get(ThreadService);
      const thread = await threadService.createThread(body);
      res.status(201).json({ message: "Insert successful", thread });
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve a single thread by its ID.
   *
   * @route GET /thread/:threadId
   */
  async getSingleThreadHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const threadId = req.params.threadId;

    try {
      const threadService = Container.get(ThreadService);
      const response = await threadService.getThreadById(threadId);
      res.status(200).json(response);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve a threads.
   *
   * @route GET /thread/:threadId
   */
  async getAllThreadsHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const threadService = Container.get(ThreadService);
      const response = await threadService.getAllThread();
      res.status(200).json(response);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve a threads by topic.
   *
   * @route GET /thread/:threadId
   */
  async getAllThreadsByTopicHandler(req: Request, res: Response, next: NextFunction) {
    const topicId = req.params.topicId;

    try {
      const threadService = Container.get(ThreadService);
      const response = await threadService.getAllThreadByTopic(topicId);
      res.status(200).json(response);
    } catch (error: any) {
      next(new AppError(error));
    }
  },
};
