import Container from "typedi";
import LoggerInstance from "./logger";
import { db } from "@/database";

export default () => {
  try {
    Container.set("logger", LoggerInstance);
    Container.set("db", db);
    LoggerInstance.info("✌️ Dependencies injected into container");
  } catch (e) {
    LoggerInstance.error("Error on dependency injector loader: %o", e);
  }
};
