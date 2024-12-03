import { useEffect, useRef, Fragment } from "react";
import { VideoType } from "@/types";
import { Socket } from "socket.io-client";

interface ScenePlayerProps {
  socket: Socket;
  video: VideoType;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const ScenePlayer = ({ socket, video }: ScenePlayerProps) => {
  const playerRef = useRef<any>(null);
  const playerInstance = useRef<any>(null);

  useEffect(() => {
    // Load YouTube Iframe API if not loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube Iframe API is ready");
      };
    }

    // Destroy previous player if exists
    if (playerInstance.current) {
      playerInstance.current.destroy();
      playerInstance.current = null;
    }

    // Create a new player
    if (video && playerRef.current) {
      playerInstance.current = new window.YT.Player(playerRef.current, {
        videoId: video?.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          playsinline: 1,
          mute: 0,
        },
        origin: window.location.origin,
        events: {
          onReady: (event: any) => {
            event.target.seekTo(video.time);
            event.target.playVideo();
            console.log("Player is ready");
            console.log(video);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              console.log("Player is playing");
              socket.emit("client__queue--play");
            } else if (event.data === window.YT.PlayerState.ENDED) {
              console.log("Video ended");
              socket.emit("client__queue--next");
            }
          },
        },
      });
    }

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
        playerInstance.current = null;
      }
    };
  }, [video, socket]);

  return (
    <Fragment>
      <div className="iframe-container">
        <div className="iframe" ref={playerRef}></div>
      </div>
    </Fragment>
  );
};
