import { useEffect, useRef, Fragment, useState } from "react";
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
  const [loadTime, setLoadTime] = useState<number | null>(null); // State to store load time

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const startTime = performance.now(); // Record start time when component mounts

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube Iframe API is ready");
      };
    }

    if (playerInstance.current) {
      playerInstance.current.destroy();
      playerInstance.current = null;
    }

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
            const player = event.target;

            // Start polling for player updates
            intervalId = setInterval(() => {
              if (playerInstance.current) {
                const currentTime = playerInstance.current.getCurrentTime();
                socket.emit("client__video--update", {
                  state: 1,
                  time: currentTime,
                });
              }
            }, 3000);

            // Wait for the video to start playing
            const waitForPlayingState = () => {
              const playStartTime = performance.now();
              const elapsedTime = (playStartTime - startTime) / 1000; 
              setLoadTime(elapsedTime);

              console.log(`Video started playing after ${elapsedTime.toFixed(2)} seconds`);

              // Seek to video.time + elapsedTime
              const seekTime = video.time + elapsedTime;
              console.log(`Seeking to: ${seekTime.toFixed(2)} seconds`);
              player.seekTo(seekTime, true);
            };

            // Check when the video starts playing
            const checkStateInterval = setInterval(() => {
              if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
                clearInterval(checkStateInterval);
                waitForPlayingState();
              }
            }, 100); 
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              console.log("Player is playing");
            } else if (event.data === window.YT.PlayerState.ENDED) {
              console.log("Video ended");
              socket.emit("client__video--update", {
                state: 0,
                time: 0,
              });
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

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [video, socket]);

  return (
    <Fragment>
      <div className="iframe-container">
        <div className="iframe" ref={playerRef}></div>
      </div>
      {loadTime !== null && (
        <p>Time taken for the video to start playing: {loadTime.toFixed(2)} seconds</p>
      )}
    </Fragment>
  );
};
