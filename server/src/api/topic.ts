import { Request, Response, NextFunction } from "express";
import { AppError } from "@/libs/app-error";
import Container from "typedi";
import TopicService from "@/service/topic";

/**
 * Controller for handling topic-related HTTP requests.
 */
export default {
  /**
   * Handler to create a new topic.
   *
   * @route POST /topic/create
   */
  async createTopicHandler(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const file = req.file; 

    try {
      if (file) {
        body.attachment = file.path;
      }

      const topicService = Container.get(TopicService);
      const topic = await topicService.createTopic(body);
      res.status(201).json({ message: "Topic created successfully", topic });
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve all topics.
   *
   * @route GET /topic
   */
  async getAllTopicsHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const topicService = Container.get(TopicService);
      const topics = await topicService.getAllTopics();
      res.status(200).json(topics);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve a single topic by its ID.
   *
   * @route GET /topic/:topicId
   */
  async getSingleTopicHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const topicId = req.params.topicId;

    try {
      const topicService = Container.get(TopicService);
      const topic = await topicService.getTopicById(topicId); 
      res.status(200).json(topic);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to follow a topic.
   *
   * @route POST /topic/follow
   */
  async followTopicHandler(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    try {
      const topicService = Container.get(TopicService);
      const result = await topicService.followTopic(body);
      res.status(200).json(result);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve a single topic by its ID.
   *
   * @route GET /topic/followers/:topicId
   */
  async getTopicFollowersHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const topicId = req.params.topicId;

    try {
      const topicService = Container.get(TopicService);
      const followers = await topicService.getTopicFollowers(topicId);
      res.status(200).json(followers);
    } catch (error: any) {
      next(new AppError(error));
    }
  },
};
