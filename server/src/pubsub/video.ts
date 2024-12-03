import { VideoOptions } from "@/types";

class Video {
    public readonly id: string;
    private readonly title: string;
    private readonly thumbnail: string;
    private state: number = -1;
    private time: number = 0;
    private lastSyncTime: number = 0;

    constructor({ id, title, thumbnail }: VideoOptions) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
    } 

    /**
     * Get basic information about the video
     */
    data(): object {
        return {
            id: this.id,
            title: this.title,
            thumbnail: this.thumbnail,
        };
    }

    /**
     * Get detailed information about the video
     */
    fullData(): object {
        return {
            ...this.data(),
            state: this.state,
            time: this.getTime(),
        };
    }

    /**
     * Set the video state
     * @param state Target video state (see YT.PlayerState)
     */
    setState(state: number): void {
        this.state = state;
    }

    getState(): number {
        return this.state;
    }

    /**
     * Set the video time
     * @param time Target video time
     */
    setTime(time: number): void {
        this.time = time;
        this.lastSyncTime = Date.now();
    }

    /**
     * Get the extrapolated video time
     * @returns {number}
     */
    getTime(): number {
        // if the current video is not playing (YT.PlayerState.PLAYING) return the current
        // time without extrapolation
        if (this.state !== 1) {
          return this.time;
        }
    
        // figure out how long has elapsed since the last clock update
        // return (this.time + (Math.abs(Date.now() - this.lastSyncTime) / 1000));
        return this.time;
    }


    /**
     * Reset's video state
     */
    reset(): void {
        this.setTime(0);
        this.setState(-1);
    }
}

export default Video;