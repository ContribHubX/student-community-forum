import { validateRequest, verifyAuth } from "@/api/middleware";
import { communitySchema, joinCommunitySchema } from "@/libs/validators/community-validator";
import { Router } from "express";
import communityContoller from "@/api/community"
import eventContoller from "@/api/event";
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

  router.post(
    "/event",
    verifyAuth,
    eventContoller.createCommunityEventHandler
  );

  router.get("/", verifyAuth, communityContoller.getCommunitiesHandler);
  
  router.get("/joined", verifyAuth, communityContoller.getUserCommunitiesHandler);

  router.get("/event/:communityId", verifyAuth, eventContoller.getAllCommunityEventsHandler);

  router.get("/:communityId", verifyAuth, communityContoller.getCommunityHandler);

  router.get("/members/:communityId", verifyAuth, communityContoller.getCommunityMembersHandler);

}