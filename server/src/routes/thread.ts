import { Router } from "express";
import threadController from "@/api/thread";
import { validateRequest, verifyAuth } from "@/api/middleware";
import { threadSchema } from "@/libs/validators/thread-validator";
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
  router.get("/", verifyAuth, threadController.getAllThreadsHandler);
  router.get("/:threadId", verifyAuth, threadController.getSingleThreadHandler);
};
