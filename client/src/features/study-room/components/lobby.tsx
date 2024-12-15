import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetStudyRoom } from "../api/get-room";
import { Activities } from "./activities";
import { UsersPanel } from "./users-panel";
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { LobbyOptions } from "./lobby-options";

import { User } from "@/types";
import { CollaborativeWhiteboard } from "./white-board";

interface LobbyProp {
  user: User;
}

export const Lobby = ({ user }: LobbyProp) => {
  const { roomId } = useParams();
  const { data: room } = useGetStudyRoom({ roomId: roomId || "" });
  const { socketState } = useSocketProvider();
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const roomUsers =
    roomId && socketState ? socketState.rooms[roomId]?.users || [] : [];

  useEffect(() => {
    if (!room || !user || !socketState.socket) return;

    socketState.socket.emit("client__user-room--join", {
      user,
      room,
    });

    return () => {
      socketState.socket?.emit("client__user-room--left", {
        user,
        roomId: room.id,
      });

      console.log("unmounting ");

      socketState.socket?.off("client__user-room--join");
      socketState.socket?.off("client__user-room--left");
    };
  }, [room, socketState.socket, user]);

  const handleShowPanel = useCallback(
    (value: string) => setShowPanel(value === "true"),
    [],
  );

  return (
    <div>
      <div
        className={`z-[11] relative flex ${!showPanel ? "px-0" : "px-2"} flex-col md:flex-row justify-between gap-0 py-2 mt-12 md:mt-0 `}
      >
        <motion.div
          className=""
          initial={{ x: 0 }}
          animate={{ x: showPanel ? 0 : "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <UsersPanel
            users={roomUsers || []}
            handleShowboard={() => setShowWhiteboard(true)}
          />
        </motion.div>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: showPanel ? 0 : "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Activities roomId={roomId || ""} />
        </motion.div>
      </div>

      {showWhiteboard && (
        <motion.div
          className="absolute inset-0 z-30 bg-[#1e252b]/80 backdrop-blur-sm"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CollaborativeWhiteboard
            roomId={roomId || ""}
            handleClose={() => setShowWhiteboard(false)}
          />
        </motion.div>
      )}

      <div className="absolute bg-transparent w-screen h-svh  top-0 ">
        <LobbyOptions handleShowPanel={handleShowPanel} />
      </div>
    </div>
  );
};
