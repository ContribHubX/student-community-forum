import { Router } from "express";
import auth from "./auth";
import thread from "./thread";

export default () => {
  const app = Router();
  auth(app);
  thread(app);

  return app;
};
