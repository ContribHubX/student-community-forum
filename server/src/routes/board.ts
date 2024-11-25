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

  router.post(
    "/member",
    verifyAuth, 
    boardController.addBoardMemberHandler
  );

  router.get("/", verifyAuth, boardController.getAllBoardsHandler);

  router.get("/member", verifyAuth, boardController.getBoardMembersHandler);

  router.get("/shared", verifyAuth, boardController.getSharedBoardsHandler);

  router.get("/:boardId", verifyAuth, boardController.getBoardByIdHandler);
}