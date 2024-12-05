import { PropsWithChildren, useEffect, useReducer } from "react";
import { defaultSocketContextState, OPERATION, socketReducer } from "./context";
import { useSocket } from "@/hooks/use-socket";
import { SocketContextProvider } from "./context";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

// TODO naay problem ig create sa comment kung ang user bag o ra ni login dayun mo comment kelangan pa e refresh
// TODO investigate socket when creating comment

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
      userId: authState?.user?.id.toString(),
    },
  });

  useEffect(() => {
    if (!authState?.user?.id) {
      console.log("User ID not available yet, waiting for auth state.");
      return;
    }

    if (socket) {
      /** Connect to the web socket **/
      socket.auth = { userId: authState.user.id.toString() };
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
  }, [socket, authState]);

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
          console.log(data)
          socketDispatch({
            type: OPERATION.ADD_NEW_THREAD,
            payload: { thread: data, queryClient },
          });
          break;

        case "comment--new":
          console.log(data);
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

        case "request--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_REQUEST,
            payload: {
              request: data,
              queryClient,
            },
          });
          break;

        case "topic-follow--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_TOPIC_FOLLOWER,
            payload: {
              data,
              queryClient,
            },
          });
          break;

        case "board--new":
          socketDispatch({
            type: OPERATION.ADD_NEW_BOARD,
            payload: {
              data,
              queryClient,
            },
          });
          break;

        case "task--new":
          socketDispatch({
            type: OPERATION.ADD_TASK,
            payload: {
              data,
              queryClient,
            },
          });
          break;

        case "task--updated":
          socketDispatch({
            type: OPERATION.UPDATE_TASK,
            payload: {
              data,
              queryClient,
            },
          });
          break;

        case "user--joined":
          socketDispatch({
            type: OPERATION.ADD_NEW_USER_TO_BOARD,
            payload: {
              data,
            },
          });
          break;

        case "mouse--move":
          socketDispatch({
            type: OPERATION.UPDATE_USER_POSITION,
            payload: {
              data,
            },
          });
          break;

        case "users--initial":
          socketDispatch({
            type: OPERATION.INIT_BOARD_USERS,
            payload: {
              data,
            },
          });
          break;

        case "user--left":
          socketDispatch({
            type: OPERATION.REMOVE_USER_TO_BOARD,
            payload: {
              user: data.user,
              boardId: data.boardId,
            },
          });
          break;

        case "vote--new":
          socketDispatch({
            type: OPERATION.ADD_QUESTION_VOTE,
            payload: {
              data,
              queryClient,
            },
          });
          break;

        case "notification--new":
          console.log(data);
          socketDispatch({
            type: OPERATION.ADD_NEW_NOTIF,
            payload: {
              data,
              queryClient,
            },
          });
          break;

        case "room-users--initial":
          socketDispatch({
            type: OPERATION.INIT_ROOM_USERS,
            payload: {
              data,
            },
          });
          break;

        case "user-room--joined":
          socketDispatch({
            type: OPERATION.ADD_ROOM_USER,
            payload: {
              user: data.user,
              roomId: data.roomId,
            },
          });
          break;

        case "user-room--left":
          socketDispatch({
            type: OPERATION.REMOVE_USER_TO_ROOM,
            payload: {
              user: data.user,
              roomId: data.roomId,
            },
          });
          break;

        case "room-chat--new":
          socketDispatch({
            type: OPERATION.ADD_ROOM_CHAT,
            payload: {
              chat: data,
              queryClient,
            },
          });
          break;

        case "video--next":
          socketDispatch({
            type: OPERATION.PLAY_NEXT_VIDEO,
            payload: {
              video: data.video,
              roomId: data.roomId,
            },
          });
          break;

        case "video--clock":
          console.log(data);
          socketDispatch({
            type: OPERATION.SYNC_VIDEO_CLOCK,
            payload: {
              time: data.time,
              roomId: data.roomId,
            },
          });
          break;

        case "video--play":
          console.log("new video play: " + JSON.stringify(data, null, 2));
          socketDispatch({
            type: OPERATION.PLAY_VIDEO,
            payload: {
              video: data.video,
              roomId: data.roomId,
            },
          });
          break;

        case "timer--sync":
          socketDispatch({
            type: OPERATION.TIMER_SYNC,
            payload: {
              time: data.time,
              roomId: data.roomId,
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
