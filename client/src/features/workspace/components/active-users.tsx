import { useEffect } from "react";

import { useMouse } from "@/hooks/use-mouse";
import { useSocketProvider } from "@/hooks/use-socket-provider";

import { UserCursor } from "./user-cursor";
import { BoardState, User } from "@/types";
import { colors } from "../constant";

interface ActiveUserProp {
  currentUser: User;
  boardState: BoardState[];
  boardId: string;
}

export const ActiveUsers = ({
  currentUser,
  boardState,
  boardId,
}: ActiveUserProp) => {
  const { socketState } = useSocketProvider();
  const { x, y } = useMouse();

  useEffect(() => {
    if (!socketState.socket) return;

    // Emit mouse movement for the current user
    socketState.socket.emit("client__mouse--move", {
      user: currentUser,
      position: { x, y },
      boardId,
    });

    // Clean up the socket listener
    return () => {
      socketState.socket?.off("client__mouse--move");
    };
  }, [boardId, socketState.socket, currentUser, x, y]);

  if (!socketState) return null;

  return (
    <div>
      {boardState?.length &&
        boardState.map((userState) => (
          <div key={userState.user.id}>
            {currentUser.id.toString() !== userState.user.id.toString() && (
              <UserCursor
                user={userState.user}
                position={userState.position}
                color={colors[Math.abs(userState.color % colors.length)]}
              />
            )}
          </div>
        ))}
    </div>
  );
};
