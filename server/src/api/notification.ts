import Container from "typedi";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import NotificationService from "@/service/notification";

export default {
    /**
     * Handler to retrieve a user notifications by its ID.
     *
     * @route GET /notif/:userId
     */
    async getNotificationsHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const userId = req.params.userId;

        try {
            const notifService = Container.get(NotificationService);
            const response = await notifService.getNotifications(userId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error, 500));
        }
    },
}