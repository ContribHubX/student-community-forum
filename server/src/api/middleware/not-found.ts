import { Response, Request, NextFunction } from "express";
import { AppError } from "@/libs/app-error";

export function notFound(req: Request, res: Response, next: NextFunction) {
  return next(new AppError("Route not found", 404));
}


