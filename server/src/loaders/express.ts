import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dependencyInjector from "./dependency-injector";
// import errorHandler from "@/api/middleware/error-handler";
// import routes from "@/api";
import dotenv from "dotenv";
dotenv.config();

export default ({ app }: { app: Application }) => {
  /**
   * Health check endpoints
   * @TODO Explain why they are here
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
  app.use(cors({
    origin: 'http://localhost:5173'
  }));
  app.use(express.json());
  app.use(cookieParser());

  /**
   * Inject dependencies
   */
  dependencyInjector();

  /**
   * Setup routes
   */
//   app.use("/api", routes());

  /**
   * Init Custom middlewares
   */
//   app.use(errorHandler);
};