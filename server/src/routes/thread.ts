import { Router } from "express";
import threadController from "@/api/thread";
import threadReactionController from "@/api/thread-reaction";
import { validateRequest, verifyAuth } from "@/api/middleware";
import { threadSchema,threadReactionSchema, threadCommentSchema } from "@/libs/validators/thread-validator";
import { uploadThread } from "@/libs/cloudinary-storage";

const router = Router();

export default (app: Router) => {
  app.use("/thread", router);

  router.post(
    "/create",
    verifyAuth,
    uploadThread.single("attachment"),
    validateRequest(threadSchema),
    threadController.createThreadHandler,
  );

  router.post("/react", 
    verifyAuth,
    validateRequest(threadReactionSchema),
    threadReactionController.reactThreadHandler
  );

  router.post("/comment", 
    verifyAuth,
    validateRequest(threadCommentSchema),
    threadReactionController.commentThreadHandler
  )

  router.get("/", verifyAuth, threadController.getAllThreadsHandler);

  router.get("/:threadId", verifyAuth, threadController.getSingleThreadHandler); 

  router.get("/comment/:threadId", verifyAuth, threadReactionController.getCommentsHandler);
  
} ;
