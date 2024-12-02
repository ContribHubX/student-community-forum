import { useEffect, useRef, Fragment } from 'react';
import { MusicType } from '@/types';

interface ScenePlayerProps {
  music: MusicType;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}


export const ScenePlayer = ({ music }: ScenePlayerProps) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (music && playerRef.current) {
      new window.YT.Player(playerRef.current, {    
        videoId: music?.id  ,
        playerVars: { 
          autoplay: 1, 
          controls: 0,
          rel: 0,
          playsinline: 1
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onReady: (event: any) => {
            console.log('Player is ready')
          },
          onStateChange: onPlayerStateChange,
        },
      });
    }
  }, [music])

  


  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      console.log('Player is playing');
    }
  };

  // const handlePlay = () => {
  //   if (player) {
  //     player.playVideo();
  //   }
  // };

  // const handlePause = () => {
  //   if (player) {
  //     player.pauseVideo();
  //   }
  // };

  return (
    <Fragment>
      <div className='iframe-container'>
        <div className='iframe' ref={playerRef} >
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
       {/* <button onClick={handlePlay}>Play</button>
       <button onClick={handlePause}>Pause</button> */}
      </div>
    </Fragment>
  );
};
