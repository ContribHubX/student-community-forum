import { ICommunity } from "@/domain/interfaces/ICommunity";
import { IArgument } from "@/domain/interfaces/IArgument";
import { DiscussionClient, DiscussionClientOption } from "@/types";
import Client from "./client";

class DiscussionRoom {
    public details: ICommunity;
    private readonly clients: Map<string, DiscussionClient> = new Map();
    private arguments: IArgument[];

    constructor(details: ICommunity) {
       this.details = {...details};
       this.arguments = [];
    }

    connect(socketClient: DiscussionClientOption) {
        const { user, client } = socketClient;

        this.clients.set(user.id.toString(), { user, client });
  
        this.emit("user-discussion--joined", this.userJoined(socketClient), [client]);

        client.on("discussion-argument--new", (data) => this.newArgument(data));

        client.on("discussion-argument--react", (data) => this.react(data));
        
        client.on("user-discussion--left", (data) => this.disconnect(data));
    }

    /**
     * 
     * @param data 
     */
    disconnect(data: any) {
        const userId = data.user.id.toString();

        const client = this.clients.get(userId);
        
        if (!client || !client.user) return;
        
        this.clients.delete(userId);

        this.emit("user-discussion--left", { user: client.user, discussionId: this.details.id });
    }

    /**
     * 
     * @param socketClient 
     */
    userJoined(socketClient: DiscussionClientOption) {
        const { user, client } = socketClient;
        
        client.send("discussion-state--initial", this.initialDiscussionState());

        // console.log(user);

        return { user, discussionId: this.details.id };
    }

    /**
     * 
     * @param data 
     */
    newArgument(data: any) {
        const argument = data;

        const isPresent = this.arguments.some(arg => arg.id === argument.id);

        if (isPresent) return;

        this.arguments = [argument as IArgument, ...this.arguments];

        this.emit("discussion-argument--new", { argument, discussionId: this.details.id });
    }

    /**
     * 
     * @param data 
     */
    react(data: any) { 
        let reactedArgument: IArgument | null = null; 
        
        this.arguments = this.arguments.map(arg => {
            if (arg.id === data.argumentId) {
                if (data.reaction === "like")
                    arg.likeCount = arg.likeCount + 1;
                else 
                    arg.dislikeCount = arg.dislikeCount + 1;

                reactedArgument = arg;
            }

            return arg; 
        })

        this.emit("discussion-argument--react", { argument: reactedArgument, discussionId: this.details.id });
    }

    /**
     * Retrieves the initial state of the discussion.
     * 
     * @param 
     * @returns 
     */
    initialDiscussionState() {
        const users = Array.from(this.clients.entries()).map(([id, entry]) => ({
            ...entry.user
        }));
                
        return { users, arguments: this.arguments, community: this.details  };
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

export default DiscussionRoom;

