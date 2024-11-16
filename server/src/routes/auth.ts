import { Router } from "express";
import authController from "@/api/auth";

const router = Router();

export default (app: Router) => {
  app.use("/auth", router);

  router.get("/google", authController.generateGoogleAuthURL);

  router.get("/github", authController.generateGithubAuthURL);

  router.get("/google/callback", authController.googleAuthCallback);

  router.get("/github/callback", authController.githubAuthCallback);
  
  router.get("/me", authController.getMyDetails);
};
