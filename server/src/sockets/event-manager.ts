import { Service } from "typedi";
import Client from "./client";
import { ClientEventOptions } from "@/types";

// TODO implement notif pub/sub
// TODO revise publish to publishToOne and publishToMany

@Service()
class EventManager {
    private readonly clients: Map<string, Client> = new Map();
    
    connect(socketClient: ClientEventOptions) {
        // add client 
        this.clients.set(socketClient.userId, socketClient.client); 
    }

    /**
     * Publish an event to the connected clients
     * 
     * @param client 
     * @param data 
     */
    publish<T>(identifier: string, data: T | undefined, client?: Client): void {
        this.emit(identifier, data, client);
    } 

    /**
     * Send a packet to all clients in the room
     * 
     * @param identifier Packet type identifier
     * @param data Data to send to the clients
     * @param ignore Client not to send the packet to
     */
    emit(identifier: string, data: any = {}, ignore?: Client): void {
        const ignoredClient = ignore;

        const filteredClients = ignoredClient 
                            ? Array.from(this.clients.values()).filter(client => !client.is(ignoredClient))
                            : Array.from(this.clients.values());

        filteredClients.forEach(client => client.send(identifier, data));
                                                
    }
}

export default EventManager;