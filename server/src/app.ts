import "reflect-metadata";
import express from "express";
import Logger from "@/loaders/logger";
import {
  Server as ServerListener,
  type IncomingMessage,
  type ServerResponse,
} from "http";

async function startServer() {
  const app = express();
  let serverListener: ServerListener<
    typeof IncomingMessage,
    typeof ServerResponse
  >;

  (await import("./loaders/express")).default({ app });

  serverListener = app
    .listen(3000, () => {
      Logger.info(`
            ################################################
                🛡️  Server listening on port: ${3000} 🛡️
            ################################################      
        `);
    })
    .on("error", (err) => {
      Logger.error(err.message);
      process.exit(1);
    });
}

startServer();
