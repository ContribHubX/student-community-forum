import "reflect-metadata";
import express from "express";
import Logger from "@/loaders/logger";
import {
  Server as ServerListener,
  type IncomingMessage,
  type ServerResponse,
} from "http";
import { Server as IOServer } from "socket.io";
import socketHandler from "@/loaders/socket";
import { corsConfig } from "@/config/cors";

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  let serverListener: ServerListener<
    typeof IncomingMessage,
    typeof ServerResponse
  >;

  (await import("./loaders/express")).default({ app });

  serverListener = app
    .listen(port, () => {
      Logger.info(`
            ################################################
                🛡️  Server listening on port: ${port} 🛡️
            ################################################      
        `);

      // initSocket
      socketHandler(new IOServer(serverListener, corsConfig));
    })
    .on("error", (err) => {
      Logger.error(err.message);
      process.exit(1);
    });
}

startServer();
