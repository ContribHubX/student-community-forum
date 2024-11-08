import { Request, Response, NextFunction } from "express";
import { AppError } from "@/libs/app-error";

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const msg = JSON.parse(err.message);
    res.status(err.status).json({ msg });
  } catch (error) {
    res.status(err.status).json({ msg: err.message });
  }
}
