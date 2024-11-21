import { Router } from "express";
import authController from "@/api/auth";

const router = Router();

export default (app: Router) => {
  app.use("/auth", router);

  router.get("/url/:provider", authController.generateAuthURL);

  router.get("/:provider/callback", authController.authCallback);
    
  router.get("/me", authController.getMyDetails);
};
