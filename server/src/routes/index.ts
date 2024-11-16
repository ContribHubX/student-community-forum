import { Router } from "express";
import auth from "./auth";
import thread from "./thread";
import notification from "./notification";

export default () => {
  const app = Router();
  auth(app);
  thread(app);
  notification(app);

  return app;
};
