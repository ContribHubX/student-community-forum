import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { HiOutlineSpeakerWave, HiPause, HiPlay } from "react-icons/hi2";
import { TbVideoOff } from "react-icons/tb";
import { CiMicrophoneOff } from "react-icons/ci";
import { TbScreenShare } from "react-icons/tb";
import { FaEllipsis } from "react-icons/fa6";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Scene } from "./scene";
import { VideoType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractVideoId } from "@/utils";
import { useSocketProvider } from "@/hooks/use-socket-provider";

export const LobbyOptions = () => {
  const { roomId } = useParams();
  const { socketState } = useSocketProvider();
  const [video, setVideo] = useState<VideoType>({} as VideoType);

  useEffect(() => {
    if (!roomId || !socketState || !socketState?.rooms[roomId]) return;

    setVideo(socketState.rooms[roomId].video);
  }, [roomId, socketState]);

  if (!socketState.socket) return <p>Loading...</p>;


  return (
    <div className="w-screen h-full relative flex items-center justify-center px-4 md:p-0">
      <div className="absolute w-screen h-svh">
        <Scene 
          video={video}
          socket={socketState.socket}
        />
      </div>

      <div className="flex flex-col items-center justify-between h-full">
        <div className="relative">
          <LobbyHeader />
        </div>
        <div className="relative  py-1 px-2 bg-canvas rounded-full flex mb-2 z-[12]">
          <div>
            <MusicManager 
              video={video}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LobbyHeader = () => {
  return <div>lobby-header</div>;
};


interface MusicManagerProp {
  video: VideoType
}

const MusicManager = ({ video }: MusicManagerProp) => {
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isPlaying, setIsPlaying] = useState(true)
  const diskRef = useRef<HTMLDivElement>(null)
  
  const { socketState } = useSocketProvider();

  const API_KEY = "AIzaSyAIUGXleJi4qn9rRMA8j-TouEdE0YKdtqw";

  useEffect(() => {
    let animationId: number
    const rotateDisk = () => {
      if (diskRef.current && isPlaying) {
        diskRef.current.style.transform = `rotate(${Date.now() / 50 % 360}deg)`
      }
      animationId = requestAnimationFrame(rotateDisk)
    }
    if (isPlaying) {
      rotateDisk()
    }
    return () => cancelAnimationFrame(animationId)
  }, [isPlaying])

  const handleAddVideo = async () => {
    if (!youtubeLink || !socketState.socket) return;
  
    const videoId = extractVideoId(youtubeLink);
    if (!videoId) {
      console.error("Invalid YouTube link");
      return;
    }
    
    console.log(videoId);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
      );
      const data = await response.json();
  
      if (!data.items || data.items.length === 0) {
        console.error("Video not found");
        return;
      }
      
      const video = data.items[0].snippet;
  
      const newVideo: VideoType = {
        id: videoId,
        title: video.title,
        thumbnail: video.thumbnails.high.url,
        state: 0,
        time: 0,
      };
      
      socketState.socket.emit("client__video--play", { ...newVideo })
      setYoutubeLink('');
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex gap-4 items-center rounded-full py-3 px-4 bg-black/80 text-white backdrop-blur-sm">
      <div className="relative w-12 h-12">
        <div 
          ref={diskRef} 
          className="w-full h-full rounded-full overflow-hidden transition-transform duration-200 ease-linear"
          style={{
            backgroundImage: `url(${video?.thumbnail || 'https://placekitten.com/200/200'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={togglePlayPause} className="text-white text-xl">
            {isPlaying ? <HiPause /> : <HiPlay />}
          </button>
        </div>
      </div>
      <div className="flex-col hidden md:flex text-sm">
        <span className="font-medium">
          {video?.title || "No track selected"}
        </span>
        <span className="text-xs text-gray-400">Study Room Music</span>
      </div>
      <div className="flex items-center gap-3 text-lg ml-auto">
        <HiOutlineSpeakerWave />
        <TbVideoOff />
        <CiMicrophoneOff />
        <TbScreenShare />
        <Popover>
          <PopoverTrigger>
            <FaEllipsis />
          </PopoverTrigger>  
          <PopoverContent className="w-80 p-0 bg-black/90 border-gray-800 text-white">
            <MusicManagerPopover 
              currentVideo={video}
              youtubeLink={youtubeLink}
              setYoutubeLink={setYoutubeLink}
              handleAddVideo={handleAddVideo}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

const MusicManagerPopover = ({ 
  youtubeLink, 
  setYoutubeLink, 
  handleAddVideo 
}: { 
  currentVideo: VideoType | null, 
  youtubeLink: string, 
  setYoutubeLink: (link: string) => void, 
  handleAddVideo: () => void 
}) => {
  return (
    <div className="space-y-4 p-4 bg-white border-0 rounded-md">
      <div className="flex space-x-2">
        <Input 
          type="text" 
          placeholder="Paste YouTube link" 
          value={youtubeLink} 
          onChange={(e) => setYoutubeLink(e.target.value)}
          className="bg-gray-200 border-gray-700 border-1 text-black"
        />
        <Button onClick={handleAddVideo} className="text-sm" variant="secondary">Play</Button>
      </div>
    </div>
  )
}
