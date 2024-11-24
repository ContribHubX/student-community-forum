import { Router } from "express";
import auth from "./auth";
import thread from "./thread";
import notification from "./notification";
import community from "./community";
import topic from "./topic";
import question from "./question";
import user from "./user";
import board from "./board";
import task from "./task";

export default () => {
  const app = Router();
  auth(app);
  thread(app);
  notification(app);
  community(app);
  topic(app);
  question(app);
  user(app);
  board(app);
  task(app);

  return app;
};
