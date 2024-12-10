import { Router } from "express";
import authController from "@/api/auth";
import { uploadProfile } from "@/libs/cloudinary-storage";

const router = Router();

export default (app: Router) => {
  app.use("/auth", router);

  router.get("/url/:provider", authController.generateAuthURL);

  router.get("/:provider/callback", authController.authCallback);
    
  router.get("/me", authController.getMyDetails);

  // Local auth routes
  router.post("/register", uploadProfile.single("attachment"), authController.register);

  router.post("/login", authController.login);
};
