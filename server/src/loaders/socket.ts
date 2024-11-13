import { Server, Socket } from "socket.io";
import EventManager from "@/sockets/event-manager";
import Client from "@/sockets/client";
import Container from "typedi";

export default(io: Server) => {
    const eventManager = Container.get(EventManager);

    io.on("connection", (socket: Socket) => {
        const client = new Client(socket);
        
        // connect client
        eventManager.connect(client);
    })
}