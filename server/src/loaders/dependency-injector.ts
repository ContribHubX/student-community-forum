import Container from "typedi";
import LoggerInstance from "./logger";

export default () => {
  try {
    Container.set("logger", LoggerInstance);
    LoggerInstance.info("✌️ Dependencies injected into container");
  } catch (e) {
    LoggerInstance.error("Error on dependency injector loader: %o", e);
  }
};