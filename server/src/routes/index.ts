import { Router } from "express";
import auth from "./auth";
import thread from "./thread";
import notification from "./notification";
import community from "./community";

export default () => {
  const app = Router();
  auth(app);
  thread(app);
  notification(app);
  community(app);

  return app;
};
