import { Router } from "express";
import { verifyAuth } from "@/api/middleware";
import userController from "@/api/user"; 

const router = Router();

export default (app: Router) => {
  app.use("/user", router);

  router.get("/", verifyAuth, userController.getAllUsersHandler);
}