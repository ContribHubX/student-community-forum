import { AppError } from "@/libs/app-error";
import ThreadInteractionService from "@/service/thread/thread-interaction";
import { Request, Response, NextFunction } from "express";
import Container from "typedi";

/**
 * Controller for handling thread-related interactions HTTP requests.
 *
 */
export default {
    /**
     * Handler to create reaction to a thread.
     *
     * @route POST /thread/react
     */
    async reactThreadHandler(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        try {
          const threadService = Container.get(ThreadInteractionService);
          const thread = await threadService.reactToThread(body);
          res.status(201).json({ message: "Reaction successful", thread });
        } catch (error: any) {
          next(error);
        }
    },

    /**
     * Handler to create reaction to a thread.
     *
     * @route POST /thread/comment
     */
    async commentThreadHandler(req: Request, res: Response, next: NextFunction) {
      const body = req.body;

      try {
        const threadService = Container.get(ThreadInteractionService);
        const comment = await threadService.createComment(body);
        res.status(201).json({ message: "Comment successful", comment });
      } catch (error: any) {
        next(new AppError(error));
      }
    },

    /**
     * Handler to get comments to a thread.
     *
     * @route GET /thread/comment/:threadId
     */
    async getCommentsHandler(req: Request, res: Response, next: NextFunction) {
      const threadId = req.params.threadId;

      try {
        const threadService = Container.get(ThreadInteractionService);
        const comments = await threadService.getComments(threadId);
        res.status(200).json(comments);
      } catch (error: any) {
        next(new AppError(error));
      }
    },

    /**
     * Handler to check if user already reacted.
     *
     * @route GET /thread/check?threadId=val&userId=val
     */
    async isAlreadyReactedHandler(req: Request, res: Response, next: NextFunction) {
      const threadId = req.query.threadId as string;
      const userId = req.query.userId as string;

      try {
        const threadService = Container.get(ThreadInteractionService);
        const react = await threadService.getUserReaction({ userId, threadId });
        res.status(200).json(react);
      } catch (error: any) {
        next(new AppError(error));
      }
    },
}