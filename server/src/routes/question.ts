import { Router } from "express";
import questionController from "@/api/question";
import { verifyAuth } from "@/api/middleware";
import { validateRequest } from "@/api/middleware";
import { createQuestionSchema } from "@/libs/validators/question-validator";

const router = Router();

export default (app: Router) => {
    app.use("/question", router);
  
    router.post("/", verifyAuth,  validateRequest(createQuestionSchema), questionController.createQuestionHandler);

    router.post("/request", verifyAuth, questionController.createQuestionRequestHandler);

    router.post("/vote", verifyAuth, questionController.voteQuestionHandler);

    router.get("/vote", verifyAuth, questionController.getQuestionVotesHandler);

    router.get("/", verifyAuth, questionController.getAllQuestionsHandler);

    router.get("/:questionId", verifyAuth, questionController.getQuestionByIdHandler);

    router.get("/requested/:userId", verifyAuth, questionController.getQuestionsRequestedToHandler);

    router.get("/threads/:questionId", verifyAuth, questionController.getThreadsByQuestionHandler);

    router.get("/users/:questionId", verifyAuth, questionController.getUsersByQuestionHandler);

    router.put("/:questionId", verifyAuth, questionController.updateQuestionHandler);

    router.delete("/:questionId", verifyAuth, questionController.deleteQuestionHandler);
}