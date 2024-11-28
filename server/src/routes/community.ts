import { validateRequest, verifyAuth } from "@/api/middleware";
import { communitySchema, joinCommunitySchema } from "@/libs/validators/community-validator";
import { Router } from "express";
import communityContoller from "@/api/community"
import { uploadCommunity } from "@/libs/cloudinary-storage";

const router = Router();

export default (app: Router) => {
  app.use("/community", router);

  
  router.post(
    "/",
    verifyAuth,
    uploadCommunity,
    validateRequest(communitySchema),
    communityContoller.createCommunityHandler,
  );

  router.post(
    "/join",
    verifyAuth,
    validateRequest(joinCommunitySchema),
    communityContoller.joinCommunityHandler,
  );


  router.get("/", verifyAuth, communityContoller.getCommunitiesHandler);
  
  router.get("/join", verifyAuth, communityContoller.getUserCommunitiesHandler);

  router.get("/:communityId", verifyAuth, communityContoller.getCommunityHandler);
}