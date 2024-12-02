import { IStudyRoom } from "@/domain/interfaces/IStudyRoom";
import { StudyRoomClient } from "@/types";
import Container from "typedi";
import { type Logger } from "winston";
import Client from "./client";

class StudyRoom {
    public id: string;
    private readonly clients: Map<string, StudyRoomClient> = new Map();
    private details: IStudyRoom;
    private logger: Logger;

    constructor(id: string, details: IStudyRoom) {
        this.id = id; 
        this.details = details;
        this.logger = Container.get("logger");
    }

    connect(socketClient: StudyRoomClient) {
        const { user, room, client  } = socketClient;

        this.clients.set(user.id.toString(), { client, user, room });

        client.send("room-users--initial", this.initialUsers());
        
        this.emit("user-room--joined", this.userJoined(socketClient), [client]);

        client.on("user-room--left", (data) => this.removeUser(data));
    }

    /**
     * Retrieves the initial list of users in the room.
     * 
     * @param 
     * @returns The list of users and the board ID.
     */
    initialUsers() {
        const users = Array.from(this.clients.entries()).map(([id, entry]) => ({
            ...entry.user
        }));
        return { users, room: this.details };
    }

    /**
     * 
     * @param data 
     */
    userJoined(data: StudyRoomClient) {
        return { user: data.user, roomId: data.room.id }
    }

    /**
     * 
     */
    removeUser(data: any) {
        const entry = this.clients.get(data?.user.id.toString());

        if (!entry) {
            this.logger.error("User failed to remove, cause it doenst exist");
            return;
        }

        this.clients.delete(entry.user.id.toString());

        this.emit("user-room--left", { user: entry.user, roomId: data.roomId })
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

export default StudyRoom;