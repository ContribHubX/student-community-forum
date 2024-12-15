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
import studyRoom from "./study-room";
import { attachCurrentUser } from "@/api/middleware";

export default () => {
  const app = Router();
  
  auth(app);

  app.use(attachCurrentUser);

  thread(app);
  notification(app);
  community(app);
  topic(app);
  question(app);
  user(app);
  board(app);
  task(app);
  studyRoom(app);

  return app;
};
