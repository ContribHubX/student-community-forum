import { Router } from "express";
import questionController from "@/api/question";
import { verifyAuth } from "@/api/middleware";

const router = Router();

export default (app: Router) => {
    app.use("/question", router);
  
    router.post("/", verifyAuth, questionController.createQuestionHandler);

    router.post("/request", verifyAuth, questionController.createQuestionRequestHandler);

    router.get("/", verifyAuth, questionController.getAllQuestionsHandler);

    router.get("/:questionId", verifyAuth, questionController.getQuestionByIdHandler);

    router.get("/requested/:userId", verifyAuth, questionController.getQuestionsRequestedToHandler);

    
}