import { AppError } from "@/libs/app-error";
import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export function validateRequest(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((detail) => detail.message);
      next(new AppError("Validation error", 400, details.join(",")));
    } else {
      next();
    }
  };
}
