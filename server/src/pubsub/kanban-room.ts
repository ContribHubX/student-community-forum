import { KanbanClient, KanbanClientOption } from "@/types";
import Client from "./client";
import Container from "typedi";
import { type Logger } from "winston";

class KanbanRoom {
    public id: string;
    private readonly clients: Map<string, KanbanClient> = new Map();
    private logger: Logger;
    
    constructor(id: string) { 
        this.id = id; 
        this.logger = Container.get("logger");
    }

    /**
     * Connects a client to the room and initializes user events.
     * 
     * @param socketClient - The client details and socket connection.
     */
    connect(socketClient: KanbanClientOption) {
        const { userId, client, user } = socketClient;

        const color = this.getColorFromUserId(userId);

        this.clients.set(userId.toString(), { client, user, color });

        client.send("users--initial", this.initialUsers(socketClient.boardId));

        this.emit("user--joined", this.transformInitialEntry({ ...socketClient, color }));

        client.on("user--left", (data) => this.removeUser(data));

        client.on("mouse--move", (data) => this.handleMouseMove(data));

    }
    
    /**
     * Handles the "mouse--move" event for a client.
     * 
     * @param data - The mouse movement data.
     */
    handleMouseMove(data: any) {
        this.emit("mouse--move", {
            user: data.user,
            position: { x: data.position.x, y: data.position.y },
            boardId: data.boardId
        });
    } 

    /**
     * 
     */
    removeUser(data: any) {
        const entry = this.clients.get(data.user.id.toString());
        
        if (!entry) {
            this.logger.error("User failed to remove, cause it doenst exist");
            return;
        }

        this.clients.delete(entry.user.id.toString());
        this.emit("user--left", { user: entry.user, boardId: data.boardId })
    }

    /**
     * Generates a deterministic color index based on the user ID.
     * 
     * @credits ChatGPT 
     * @param userId - The ID of the user.
     * @returns A color index (0-359).
     */
    getColorFromUserId(userId: string): number {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 360);
    }

    /**
     * Transforms user data into the initial entry format.
     * 
     * @param data - The user data.
     * @returns The transformed data.
     */
    transformInitialEntry(data: any) {
        return {
            user: data.user,
            position: { x: 0, y: 0 },
            boardId: data.boardId,
            color: data.color
        };
    }

    /**
     * Retrieves the initial list of users in the room.
     * 
     * @param boardId - The ID of the board.
     * @returns The list of users and the board ID.
     */
    initialUsers(boardId: string) {
        const userEntry = Array.from(this.clients.entries()).map(([id, entry]) => ({
            user: entry.user,
            color: entry.color
        }));
        return { userEntry, boardId };
    }

    /**
     * Emits a packet to all clients in the room, with optional exclusions.
     * 
     * @param identifier - The packet type identifier.
     * @param data - The data to send.
     * @param ignore - Clients to exclude from receiving the packet.
     */
    emit(identifier: string, data: any = {}, ignore?: Client[]): void {
        const ignoredClient = ignore;
        const filteredClients = ignoredClient
            ? Array.from(this.clients.values()).filter(
                (entry) => !ignoredClient.some((ignore) => entry.client.is(ignore)),
              )
            : Array.from(this.clients.values());      
        filteredClients.forEach((entry) => entry.client.send(identifier, data));
    }
}

export default KanbanRoom;
