import { Request, Response, NextFunction } from "express";
import { AppError } from "@/libs/app-error";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || "Internal Server Error";
  const details = err.details || null;

  res.status(status).json({
    status,
    message,
    ...(details && { details }),
  });
}
