import { validateRequest, verifyAuth } from "@/api/middleware";
import { uploadTopic } from "@/libs/cloudinary-storage";
import { Router } from "express";
import topicController from "@/api/topic";
import { createTopicSchema, followTopicSchema } from "@/libs/validators/topic-validator";

const router = Router();

export default (app: Router) => {
  app.use("/topic", router);

  router.post(
    "/",
    verifyAuth,
    uploadTopic.single("attachment"),
    validateRequest(createTopicSchema),
    topicController.createTopicHandler,
  );

  router.post(
    "/follow",
    verifyAuth,
    validateRequest(followTopicSchema),
    topicController.followTopicHandler,
  );

  router.get("/", verifyAuth, topicController.getAllTopicsHandler);

  router.get("/:topicId", verifyAuth, topicController.getSingleTopicHandler);
}
