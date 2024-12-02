import { Server, Socket } from "socket.io";
import EventManager from "@/pubsub/event-manager";
import Client from "@/pubsub/client";
import Container from "typedi";

export default(io: Server) => {
    const eventManager = Container.get(EventManager);
    
    // Middleware to authenticate and get userId
    io.use(authenticateSocket);

    io.on("connection", (socket: Socket) => {
        handleNewConnection(socket, eventManager);
    })

}

/**
 * Middleware to authenticate socket and assign userId.
 */
function authenticateSocket(socket: Socket, next: (err?: Error) => void): void {
    const userId = (socket.handshake.auth.userId || socket.handshake.headers.user_id) as string;

    if (!userId) {
        return next(new Error("Authentication error: User ID is missing"));
    }
    
    // Attach userId
    (socket as any).userId = userId;
    next();
}

/**
 * Handles a new client connection.
 */
function handleNewConnection(socket: Socket, eventManager: EventManager): void {
    const userId = (socket as any).userId.toString();
    const client = new Client(socket);

    // Connect the client using EventManager with the userId
    eventManager.connect({ userId, client });
}