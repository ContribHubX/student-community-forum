import { HiOutlineSpeakerWave } from "react-icons/hi2";

import { Scene } from "./scene";

export const LobbyOptions = () => {
  return (
    <div className="w-screen h-full relative flex items-center justify-center px-4 md:p-0">
      <div className="absolute w-screen h-svh">
        <Scene/>
      </div>

      <div className="flex flex-col items-center justify-between h-full"> 
        <div className="relative">
          <LobbyHeader/>
        </div>
        <div className="relative  py-1 px-2 bg-canvas rounded-full flex mb-2 z-[12]"> 
          <div>
            <MusicManager/>
          </div>     
        </div>
      </div>
    </div>
  )
}

const LobbyHeader = () => {
  return (
    <div>lobby-header</div>
  )
}

const MusicManager = () => {
  return (
    <div className="flex gap-2 items-center rounded-full p-2 bg-black text-accent-foreground">
      <div className="p-[2px] bg-white rounded-full">
        <img
          src={`https://cdn.i-scmp.com/sites/default/files/styles/portrait/public/d8/images/canvas/2022/09/15/04964401-037d-434c-88d4-765f2e8ddd1f_5b91181c.jpg?itok=KOrPxJ2v&v=1663223815`}
          className="w-[30px] h-[30px] rounded-full object-cover "
        />
      </div>
      <span className="text-[.8rem] hidden lg:block">Dark Acdameida Classical...</span>
        <HiOutlineSpeakerWave className="text-xl"/>
    </div>
  )
} 
