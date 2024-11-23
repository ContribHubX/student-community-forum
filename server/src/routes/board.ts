import { validateRequest, verifyAuth } from "@/api/middleware";
import { Router } from "express";
import boardController from "@/api/board";
import { createBoardSchema } from "@/libs/validators/board-validator";

const router = Router();

export default (app: Router) => {
  app.use("/board", router);

  router.post(
    "/",
    verifyAuth,
    validateRequest(createBoardSchema),
    boardController.createBoardHandler,
  );

  router.get("/", verifyAuth, boardController.getAllBoardsHandler);

  router.get("/:boardId", verifyAuth, boardController.getBoardByIdHandler);
}