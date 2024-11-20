import { PropsWithChildren, useEffect, useReducer } from "react";
import { defaultSocketContextState, OPERATION, socketReducer } from "./context";
import { useSocket } from "@/hooks/use-socket";
import { SocketContextProvider } from "./context";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

const SocketContextComponent = ({ children }: PropsWithChildren) => {
  const [socketState, socketDispatch] = useReducer(
    socketReducer,
    defaultSocketContextState,
  );
  const { authState } = useAuth();
  const queryClient = useQueryClient();

  const socket = useSocket("http://localhost:3000", {
    autoConnect: false,
    reconnectionDelay: 5000,
    reconnectionAttempts: 5,
    withCredentials: true,
    auth: {
      userId: authState?.user?.id,
    },
  });

  useEffect(() => {
    if (socket) {
      /** Connect to the web socket **/
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      /** Update socket state **/
      socketDispatch({ type: OPERATION.UPDATE_SOCKET, payload: socket });

      /** Start the event listener **/
      startListeners();

      /** Send the handshake **/
      sendHandShake();
    }
  }, [socket]);

  const startListeners = () => {
    if (!socket) return;

    /** Default event listeners that socket-io provides  **/

    /** Reconnect event **/
    socket.io.on("reconnect", (attempt) => {
      console.info(`Reconnected on attempt: ${attempt}`);
    });

    /** Reconnect event **/
    socket.io.on("reconnect_attempt", (attempt) => {
      console.info(`Reconnection attempt: ${attempt}`);
    });

    /** Reconnection error **/
    socket.io.on("reconnect_error", (attempt) => {
      console.info(`Reconnection error: ${attempt}`);
    });

    /** Reconnection failed **/
    socket.io.on("reconnect_failed", () => {
      console.info(`Reconnection failture`);
      alert(`We are unable to connect you to the web socket.`);
    });
  };

  const sendHandShake = () => {
    if (!socket) return;

    /** Listen on socket events **/
    socket.on("recv", (data) => {
      switch (data.eventType) {
        case "thread--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_THREAD,
            payload: { thread: data, queryClient },
          });
          break;
        case "comment--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_COMMENT,
            payload: { comment: data, queryClient },
          });
          break;

        case "like--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_REACTION,
            payload: {
              currentUserId: authState?.user?.id || "",
              reaction: data,
              queryClient,
            },
          });
          break;

        case "dislike--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_REACTION,
            payload: {
              currentUserId: authState?.user?.id || "",
              reaction: data,
              queryClient,
            },
          });
          break;
      }
    });
  };

  return (
    <SocketContextProvider value={{ socketState, socketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
