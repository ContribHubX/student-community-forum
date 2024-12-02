import { useEffect } from "react";
import { useParams } from "react-router-dom"

import { useGetStudyRoom } from "../api/get-room"
import { Activities } from "./activities"
import { UsersPanel } from "./users-panel"
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { LobbyOptions } from "./lobby-options";

import { User } from "@/types";
// import { users } from "@/features/shared/data/users";

interface LobbyProp {
    user: User;
}


// TODO fix unmounting

export const Lobby = ({ user }: LobbyProp) => {
  const { roomId } = useParams();
  const { data: room } = useGetStudyRoom({ roomId: roomId || "" });
  const { socketState } = useSocketProvider();
  const roomUsers = roomId && socketState ? socketState.rooms[roomId]?.users || [] : [];


  useEffect(() => {
    if (!room || !user || !socketState.socket) return;

    socketState.socket.emit("client__user-room--join", { 
        user,
        room
    })

    return () => {
        socketState.socket?.emit("client__user-room--left", {
            user,
            roomId: room.id
        });
        
        console.log("unmounting ")

        socketState.socket?.off("client__user-room--join");
        socketState.socket?.off("client__user-room--left");
      };
  }, [room, socketState.socket, user])

  return (
    <div>
        <div className="z-[11] relative flex px-2 flex-col md:flex-row justify-between gap-2 py-2">
            <UsersPanel
                users={roomUsers || []} 
            />
            <Activities
                roomId={roomId || ""}
            />
        </div>

        <div className="absolute bg-transparent w-screen h-svh  top-0 ">
            <LobbyOptions/>
        </div>
    </div>
  )
}
