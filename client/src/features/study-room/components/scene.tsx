import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useSocketProvider } from "@/hooks/use-socket-provider";
import { ScenePlayer } from "./player";
import { VideoType } from "@/types";

export const Scene = () => {
  const { roomId } = useParams();
  const { socketState } = useSocketProvider();
  const [video, setVideo] = useState<VideoType>({} as VideoType);

  
  useEffect(() => {
    if (!roomId || !socketState || !socketState?.rooms[roomId]) return;
    
    setVideo(socketState.rooms[roomId].video);
  }, [roomId, socketState])
  
  if (!socketState.socket) return <p>Loading...</p>

  console.log(video)

  return (
    <div className="scene-wrapper">
      {video?.id && (
        <ScenePlayer 
          video={video} 
          socket={socketState.socket}
        />
      )}
    </div>
  );
  
};
