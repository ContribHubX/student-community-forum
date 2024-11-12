import { Service } from "typedi";
import Client from "./client";

@Service()
class EventManager {
    private readonly clients: Set<Client> = new Set();
    
    connect(client: Client) {
        // add client 
        this.clients.add(client); 
    }

    /**
     * Publish an event to the connected clients
     * @param client 
     * @param data 
     */
    newThread(data: any, client?: Client): void {
        this.emit("thread--new", data, client);
    } 

    /**
     * Send a packet to all clients in the room
     * @param identifier Packet type identifier
     * @param data Data to send to the clients
     * @param ignore Client not to send the packet to
     */
    emit(identifier: string, data: any = {}, ignore?: Client): void {
        const ignoredClient = ignore;

        const filteredClients = ignoredClient 
                            ? Array.from(this.clients).filter(client => !client.is(ignoredClient))
                            : Array.from(this.clients);

        filteredClients.forEach(client => client.send(identifier, data));
                                                
    }
}

export default EventManager;