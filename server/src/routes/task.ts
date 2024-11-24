import { validateRequest, verifyAuth } from "@/api/middleware";
import { uploadThread } from "@/libs/cloudinary-storage";
import { Router } from "express";
import { createTaskSchema } from "@/libs/validators/task-validator";
import taskController from "@/api/task";

const router = Router();

export default (app: Router) => {
  app.use("/task", router);

  router.post(
    "/",
    verifyAuth,
    uploadThread.single("attachment"),
    validateRequest(createTaskSchema),
    taskController.createTaskHandler,
  );

  router.get("/", verifyAuth, taskController.getAllTasksHandler);

  router.put("/:taskId", verifyAuth, taskController.updateTaskHandler);
}