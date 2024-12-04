import { IStudyRoom } from "@/domain/interfaces/IStudyRoom";
import { GroupTimerState, StudyRoomClient } from "@/types";
import Container from "typedi";
import { type Logger } from "winston";
import Client from "./client";
import Video from "./video";

// TODO need to extract concurrent timer logic into seperate class
// TODO fix queing
// TODO add lobby header

class StudyRoom {
    public id: string;
    private readonly clients: Map<string, StudyRoomClient> = new Map();
    private readonly videos: Video[];
    private host: Client | null = null;
    private currentVideoIndex: number = 0;
    private currentVideo: Video | null = null;
    private details: IStudyRoom;
    private logger: Logger;
    private playIntervalId: NodeJS.Timeout | null = null;
    private timerState: GroupTimerState; 
    private timerIntervalId: NodeJS.Timeout | null = null;
    private timerTimeoutId: NodeJS.Timeout | null = null;

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
        this.timerState = { state: "focus", time: 30, formattedTime: "00:00" };
        this.startTimer();
    }

    connect(socketClient: StudyRoomClient) {
        const { user, room, client  } = socketClient;
        
        // set host
        if (this.clients.size === 0) 
            this.host = client;
        
        this.clients.set(user.id.toString(), { client, user, room });
        
        this.emit("user-room--joined", this.userJoined(socketClient), [client]);

        client.on("user-room--left", (data) => this.disconnect(data));

        client.on("video--update", (data) => this.updateVideo(client, data));  
        
        client.on("video--play", (data) => this.playVideo(data));
        
        if (this.host && this.clients.size > 0) {
            this.startVideoClockSync();
        }
  
    }

    
    /**
     * 
     */
    disconnect(data: any) {
        const entry = this.clients.get(data?.user.id.toString());
    
        if (!entry) {
            this.logger.error("User failed to remove, because it doesn't exist.");
            return;
        }
        
        // atay
        //entry.client.offAll(); 

        this.clients.delete(entry.user.id.toString());
    
        if (this.clients.size === 0) {
            this.logger.info("No users left in the room. Stopping video playback.");
    
            this.stopVideoClockSync();
            this.stopTimer();
    
            this.currentVideoIndex = 0;
            this.currentVideo = this.videos[this.currentVideoIndex];
            this.currentVideo.reset();
        } else {
            // find a new host 
            if (this.host === entry.client && this.clients.size !== 0) {
                const nextClient = this.clients[Symbol.iterator]().next().value;

                if (nextClient) {
                    this.host= nextClient[1].client;
                    this.logger.info("new host: " + nextClient[1].user.name)
                }


                // this.host.send('im_the_host');s
            }
        }
    
        this.emit("user-room--left", { user: entry.user, roomId: data.roomId });
    }

    /**
     * 
     * @param data 
     */
    userJoined(data: StudyRoomClient) {
        const { user, room, client } = data;
    
        client.send("room-users--initial", this.initialRoomState(client));  
        
        if (this.timerState.time === 30)
            this.startTimer();

        return { user: user, roomId: room.id }
    }
    
    /**
     * Retrieves the initial state of the room.
     * 
     * @param 
     * @returns 
     */
    initialRoomState(client: Client) {
        if (!this.host || !this.currentVideo) return;

        const users = Array.from(this.clients.entries()).map(([id, entry]) => ({
            ...entry.user
        }));
        
        let time = this.currentVideo?.getTime() || 0;

        if (!client.is(this.host)) 
            time = time + 1.5;
                
        return { users, room: this.details, video: {...this.currentVideo?.fullData(), time: time} };
    }

    /**
     * 
     */
    updateVideo(client: Client, data: any) {
        // console.log("updating vid: " + JSON.stringify(data, null, 2));
        if (this.currentVideo) {
            this.currentVideo.setState(data.state);
            
            switch(data.state) {
                // YT.PlayerState.ENDED
                case 0: {
                    this.currentVideo.setTime(0);
                    this.nextVideo(client);
                    break;
                }

                // YT.PlayerState.PLAYING
                case 1: {
                    this.setTimeAndSyncClock(client, data.time);
                    break;
                }
                
            }
        }
    }

    /**
     * 
     */
    playVideo(data: any) {
        const { id, thumbnail, title } = data;
        
        const newVid = new Video({ id, title, thumbnail }); 

        // Insert the new video after the current video
        this.videos.splice(this.currentVideoIndex + 1, 0, newVid);
        // Update current video and index to the new video
        this.currentVideoIndex += 1;
        this.currentVideo = newVid;
        this.emit("video--play", { video: newVid.fullData(), roomId: this.details.id });
    }

    /**
     * 
     */
    nextVideo(client: Client) {
        if (!this.host?.is(client) || !this.currentVideo) return;

        if (this.currentVideoIndex === this.videos.length - 1) 
            this.currentVideoIndex = 0
        else
            this.currentVideoIndex += 1;
            
        this.currentVideo = this.videos[this.currentVideoIndex];
        
        this.emit("video--next",{ video: this.currentVideo, roomId: this.details.id });
    }

    /** 
     * 
     */
    setTimeAndSyncClock(client: Client, time: number) {
        if (!this.host?.is(client) || !this.currentVideo) return;
    
        this.currentVideo.setTime(time); 
        //this.emit('video--clock', { time: this.currentVideo.getTime() + 1, roomId: this.details.id }, [client]);        
    }
    
    /**
     * Starts or restarts the video clock sync interval.
     */
    startVideoClockSync() {
        if (this.playIntervalId) {
            clearInterval(this.playIntervalId);
        }

        this.playIntervalId = setInterval(() => {
            if (this.currentVideo && this.host) {
              const time = this.currentVideo.getTime() + 1; 
              this.emit("video--clock", { time, roomId: this.details.id });
            }
        }, 60000);
    }

    /**
     * Stops the video clock sync interval.
     */
    stopVideoClockSync() {
        if (this.playIntervalId) {
            clearInterval(this.playIntervalId);
            this.playIntervalId = null;
        }
    }

    /**
     * Starts the focus/break timer and syncs the time with all clients every second.
     */
    private startTimer() {
        const { state, time } = this.timerState;

        this.logger.info(`Starting ${state} timer for ${time} minutes.`);
     
        let remainingTime = time * 60;

        if (this.timerIntervalId) clearInterval(this.timerIntervalId);
        if (this.timerTimeoutId) clearTimeout(this.timerTimeoutId);

        this.timerIntervalId = setInterval(() => {
            remainingTime -= 1;

            const minutes = Math.floor(remainingTime / 60).toString().padStart(2, "0");
            const seconds = (remainingTime % 60).toString().padStart(2, "0");
            const formattedTime = `${minutes}:${seconds}`;
            this.timerState = {state, time: remainingTime, formattedTime};

            this.emit("timer--sync", { time: {...this.timerState}, roomId: this.details.id });

            this.logger.debug(`Timer (${state}): ${formattedTime} remaining.`);

            if (remainingTime <= 0) {
                if (this.timerIntervalId !== null) {
                    clearInterval(this.timerIntervalId); 
                }
            }
            
        }, 1000);

        this.timerTimeoutId = setTimeout(() => {
            if (this.timerIntervalId !== null) {
                clearInterval(this.timerIntervalId); 
            }
            
            // Switch the timer state and restart.
            this.timerState = state === "focus" 
                ? { state: "break", time: 10, formattedTime: "00:00"} 
                : { state: "focus", time: 30, formattedTime: "00:00"};

            this.startTimer(); 
        }, time * 60 * 1000);
    }

    /**
     * Stops the timer, if necessary.
     */
    private stopTimer() {
        if (this.timerIntervalId) {
            clearTimeout(this.timerIntervalId);
            this.timerIntervalId = null;
            this.logger.info("Timer stopped.");
            this.timerState = { state: "focus", time: 30, formattedTime: "00:00" };
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