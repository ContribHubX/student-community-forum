import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dependencyInjector from "./dependency-injector";
import { errorHandler, notFound } from "@/api/middleware";
import routes from "@/routes";
import dotenv from "dotenv";
dotenv.config();

export default ({ app }: { app: Application }) => {
  /**
   * Health check endpoints
   * @TODO
   */
  app.get("/status", (req: Request, res: Response) => {
    res.status(200).json({ message: "healthy" }).end();
  });
  app.head("/status", (req: Request, res: Response) => {
    res.status(200).end();
  });

  /**
   * Init middlewares
   */
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://192.168.43.200:5173"],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  /**
   * Inject dependencies
   */
  dependencyInjector();

  /**
   * Setup routes
   */
  app.use("/api", routes());

  /**
   * Init Custom middlewares
   */
  app.use(notFound);
  app.use(errorHandler);
};
