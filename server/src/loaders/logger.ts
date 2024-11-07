import winston from "winston";
import path from "node:path";

const logPath = path.join(__dirname, "../../my-logs.log");

const LoggerInstance = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logPath }),
  ],
});

export default LoggerInstance;