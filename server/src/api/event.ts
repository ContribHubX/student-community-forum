import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import Container from "typedi";
import CommunityEventService from "@/service/event";

export default {
  /**
   * Handler to create a new community event.
   *
   * @route POST community/event
   */
  async createCommunityEventHandler(req: Request, res: Response, next: NextFunction) {
    const dto = req.body;

    try {
      const communityEventService = Container.get(CommunityEventService);
      const response = await communityEventService.createCommunityEvent(dto);
      res.status(201).json(response);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve a community event by its ID.
   *
   * @route GET community/event/:eventId
   */
  async getCommunityEventByIdHandler(req: Request, res: Response, next: NextFunction) {
    const { eventId } = req.params;

    try {
      const communityEventService = Container.get(CommunityEventService);
      const response = await communityEventService.getCommunityEventById(eventId);
      res.status(200).json(response);
    } catch (error: any) {
      next(new AppError(error));
    }
  },

  /**
   * Handler to retrieve all community events by community ID.
   *
   * @route GET /community/event/:communityId
   */
  async getAllCommunityEventsHandler(req: Request, res: Response, next: NextFunction) {
    const { communityId } = req.params;

    try {
      const communityEventService = Container.get(CommunityEventService);
      const response = await communityEventService.getAllCommunityEvents(communityId);
      res.status(200).json(response);
    } catch (error: any) {
      next(new AppError(error));
    }
  },
};
