import { Inject, Service } from "typedi";
import Client from "./client";
import { ClientEventOptions } from "@/types";
import { Container } from "typedi";
import { type Logger } from "winston";
import KanbanRoomManager from "./kanban-room-manager";

// TODO implement notif pub/sub
// TODO revise publish to publishToOne and publishToMany

@Service()
class EventManager {
  private readonly clients: Map<string, Client> = new Map();
  private logger: Logger;

  @Inject(() => KanbanRoomManager)
  private kanbanManager!: KanbanRoomManager;

  constructor() {
    this.logger = Container.get("logger");
  }

  connect(socketClient: ClientEventOptions) {
    // add client
    this.clients.set(socketClient.userId.toString(), socketClient.client);

    socketClient.client.on("user--join", data => this.link(data));
    
  }

  /**
   * Publish an event to the connected clients
   *
   * @param identifier
   * @param data
   * @param client
   */
  publishToMany<T>(
    identifier: string,
    data: T | undefined,
    client?: Client[],
  ): void {
    this.emit(identifier, data, client);
  }

  /**
   * Publish an event to a specific clients
   *
   * @param identifier
   * @param data
   * @param clientId
   */
  publishToOne<T>(identifier: string, data: T, clientId: string): void {
    const client = this.clients.get(clientId);

    if (!client) {
      this.logger.error("Client socket not found");
      return;
    }

    this.emit(
      identifier,
      data,
      Array.from(this.clients.values()).filter((socket) => !client.is(socket)),
    );
  }

  /**
   * Send a packet to all clients in the room
   *
   * @param identifier Packet type identifier
   * @param data Data to send to the clients
   * @param ignore Client not to send the packet to
   */
  emit(identifier: string, data: any = {}, ignore?: Client[]): void {
    const ignoredClient = ignore;

    const filteredClients = ignoredClient
      ? Array.from(this.clients.values()).filter(
          (client) => !ignoredClient.some((ignore) => client.is(ignore)),
        )
      : Array.from(this.clients.values());      

    filteredClients.forEach((client) => client.send(identifier, data));
  }

  /**
   * 
   */
  link(data: any): void {
    // find user in event manager clients
    const client = this.clients.get(data.user.id.toString())!;
    
    if (!client) {
        this.logger.error("User socket not found when joining room");
        return;
    }

    this.kanbanManager.join({...data, userId: data.user.id.toString(), client});
  }
}

export default EventManager;
