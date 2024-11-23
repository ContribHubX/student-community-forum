import { AppError } from "@/libs/app-error";
import UserService from "@/service/user";
import { Request, Response, NextFunction } from "express";
import Container from "typedi";

export default {
    /**
     * Handler to create a new topic.
     *
     * @route GET /user
     */
    async getAllUsersHandler(req: Request, res: Response, next: NextFunction) {
  
      try {
        const userService = Container.get(UserService)
        const users = await userService.getAllUsers();
        res.status(201).json(users);
      } catch (error: any) {
        next(new AppError(error));
      }
    },
}