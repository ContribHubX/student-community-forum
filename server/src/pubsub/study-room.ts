import { IStudyRoom } from "@/domain/interfaces/IStudyRoom";
import { StudyRoomClient } from "@/types";
import Container from "typedi";
import { type Logger } from "winston";
import Client from "./client";
import Video from "./video";

class StudyRoom {
    public id: string;
    private readonly clients: Map<string, StudyRoomClient> = new Map();
    private readonly videos: Video[];
    private currentVideoIndex: number = 0;
    private currentVideo: Video | null = null;
    private details: IStudyRoom;
    private logger: Logger;
    private playIntervalId: NodeJS.Timeout | null = null;
    private isQueueProcessing: boolean = false;

    constructor(id: string, details: IStudyRoom) {
        this.id = id; 
        this.details = details;
        this.logger = Container.get("logger");
        this.videos = [
            new Video({ id: "nTbA7qrEsP0", title: "YOUR NAME 2160P", thumbnail:  "https://i.ytimg.com/vi/yao9ww00ul4/maxresdefault.jpg" }),
            new Video({ id: "yao9ww00ul4", title: "Visuals - Your Name (4K)", thumbnail:  "https://i.ytimg.com/vi/yao9ww00ul4/maxresdefault.jpg" }),
            new Video({ id: "LbTGR7tHV_k", title: "Naruto 20th Anniversary", thumbnail:  "https://i.ytimg.com/vi/yao9ww00ul4/maxresdefault.jpg" })
        ]
        this.currentVideo = this.videos[this.currentVideoIndex];
    }

    connect(socketClient: StudyRoomClient) {
        const { user, room, client  } = socketClient;

        
        this.clients.set(user.id.toString(), { client, user, room });

        client.send("room-users--initial", this.initialRoomState());
        
        this.emit("user-room--joined", this.userJoined(socketClient), [client]);

        client.on("user-room--left", (data) => this.removeUser(data));

        client.on("queue--play", () => this.queuePlay());

        client.on("queue--next", () => this.queueNext());
    }

    /**
     * Retrieves the initial state of the room.
     * 
     * @param 
     * @returns 
     */
    initialRoomState() {
        const users = Array.from(this.clients.entries()).map(([id, entry]) => ({
            ...entry.user
        }));
        return { users, room: this.details, video: this.currentVideo?.fullData() };
    }

    /**
     * 
     * @param data 
     */
    userJoined(data: StudyRoomClient) {
        const { user, room, client } = data;

        //client.send()
        return { user: user, roomId: room.id }
    }

    /**
     * 
     */
    removeUser(data: any) {
        const entry = this.clients.get(data?.user.id.toString());
    
        if (!entry) {
            this.logger.error("User failed to remove, because it doesn't exist.");
            return;
        }
    
        this.clients.delete(entry.user.id.toString());
    
        if (this.clients.size === 0) {
            this.logger.info("No users left in the room. Stopping video playback.");
    
            if (this.playIntervalId) {
                clearInterval(this.playIntervalId);
                this.playIntervalId = null;
            }
    
            // Reset playback state
            this.currentVideoIndex = 0;
            this.currentVideo = this.videos[this.currentVideoIndex];
            this.currentVideo.reset();
    
            this.isQueueProcessing = false; // Reset processing flag
        }
    
        this.emit("user-room--left", { user: entry.user, roomId: data.roomId });
    }
    

    /**
     * 
     */
    queuePlay() {
       if (!this.currentVideo) return;

       if (this.currentVideo.getState() === -1) 
            this.currentVideo.setState(1);

       if (this.playIntervalId) {
         clearInterval(this.playIntervalId);
       }

       this.playIntervalId = setInterval(() => {
            if (!this.currentVideo) return;
            this.currentVideo.setTime(this.currentVideo.getTime() + 1);

            //console.log( this.currentVideo.getTime());
       }, 1000)
    }

    /**
     * 
     * 
     */
    queueNext() {
        console.log("called next event");

        if (this.isQueueProcessing) {
            this.logger.warn("Queue next operation is already in progress. Skipping redundant call.");
            return;
        }
    
        this.isQueueProcessing = true; 
    
        try {
            if (!this.currentVideo) return;
    
            this.currentVideo.reset();
    
            // Increment the index safely
            this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
            console.log(this.currentVideoIndex);
    
            this.currentVideo = this.videos[this.currentVideoIndex];
    
            const videoData = this.currentVideo.fullData();
    
            if (!videoData) {
                this.logger.error("Failed to retrieve video data.");
                return;
            }
    
            // Emit the updated video state to all clients
            this.emit("video--next", { video: videoData, roomId: this.id });
        } catch (error) {
            this.logger.error("Error in queueNext: ", error);
        } finally {
            this.isQueueProcessing = false; // Release the lock
        }
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