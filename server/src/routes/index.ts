import { Router } from "express";
import auth from "./auth";
import thread from "./thread";
import notification from "./notification";
import community from "./community";
import topic from "./topic";
import question from "./question";

export default () => {
  const app = Router();
  auth(app);
  thread(app);
  notification(app);
  community(app);
  topic(app);
  question(app);

  return app;
};
