import { SocketContext } from "@/providers/socket/context";
import { useContext } from "react";

export const useSocketProvider = () => {
  const context = useContext(SocketContext);

  if (!context) throw new Error("Socket context must be wrap within app");

  return context;
};
