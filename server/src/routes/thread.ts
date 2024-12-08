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
    "/",
    verifyAuth,
    uploadThread.single("attachment"),
    validateRequest(threadSchema),
    threadController.createThreadHandler,
  );

  router.put(
    "/",
    verifyAuth,
    uploadThread.single("attachment"),
    validateRequest(threadSchema),
    threadController.updateThreadHandler,
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

  router.get("/check", verifyAuth, threadReactionController.isAlreadyReactedHandler);
  
  router.get("/:threadId", verifyAuth, threadController.getSingleThreadHandler); 

  router.get("/topic/:topicId", verifyAuth, threadController.getAllThreadsByTopicHandler); 

  router.get("/community/:communityId", verifyAuth, threadController.getAllThreadsByCommunityHandler); 

  router.get("/comment/:threadId", verifyAuth, threadReactionController.getCommentsHandler);
  
} ;
