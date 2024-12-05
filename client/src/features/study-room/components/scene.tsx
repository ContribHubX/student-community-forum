import { ScenePlayer } from "./player";
import { VideoType } from "@/types";

import { Socket } from "socket.io-client";

interface SceneProp {
  video: VideoType;
  socket: Socket;
}

export const Scene = ({ video, socket }: SceneProp) => {
  return (
    <div className="scene-wrapper">
      {video?.id && <ScenePlayer video={video} socket={socket} />}
    </div>
  );
};
