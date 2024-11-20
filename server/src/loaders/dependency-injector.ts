import Container from "typedi";
import LoggerInstance from "./logger";
import { database } from "@/database";

export default () => {
  try {
    Container.set("logger", LoggerInstance);
    Container.set("database", database);
    LoggerInstance.info("✌️ Dependencies injected into container");
  } catch (e) {
    LoggerInstance.error("Error on dependency injector loader: %o", e);
  }
};
