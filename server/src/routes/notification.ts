import { Router } from "express";
import notificationController from "@/api/notification";
import { verifyAuth } from "@/api/middleware";

const router = Router();

export default (app: Router) => {
    app.use("/notif", router);
  
    router.get(
      "/:userId",
      verifyAuth,
      notificationController.getNotificationsHandler
    );
}