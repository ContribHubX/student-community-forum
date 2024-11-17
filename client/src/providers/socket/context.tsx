import { Comment, Thread } from "@/types";
import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { getThreadsQueryOptions } from "@/features/thread/api/get-all-threads";
import { createContext } from "react";

export type SocketContextState = {
  socket: Socket | undefined;
};

export const defaultSocketContextState: SocketContextState = {
  socket: undefined,
};

export enum OPERATION {
  UPDATE_SOCKET,
  ADD_NEW_THREAD,
  ADD_NEW_COMMENT,
}

type Actions =
  | {
      type: OPERATION.ADD_NEW_THREAD;
      payload: { thread: Thread; queryClient: QueryClient };
    }
  | {
      type: OPERATION.ADD_NEW_COMMENT;
      payload: { comment: Comment; queryClient: QueryClient };
    }
  | { type: OPERATION.UPDATE_SOCKET; payload: Socket };

export const socketReducer = (
  state: SocketContextState,
  action: Actions,
): SocketContextState => {
  switch (action.type) {
    case OPERATION.UPDATE_SOCKET:
      return { ...state, socket: action.payload };
    case OPERATION.ADD_NEW_THREAD: {
      const { thread, queryClient } = action.payload;
      queryClient.setQueryData(
        getThreadsQueryOptions().queryKey,
        (oldThreads: Thread[] | undefined) => {
          return oldThreads ? [thread, ...oldThreads] : undefined;
        },
      );
      return { ...state };
    }
    case OPERATION.ADD_NEW_COMMENT: {
      const { comment, queryClient } = action.payload;
      console.log(comment);
      queryClient.setQueryData(
        ["comments"],

        (oldComments: Comment[] | undefined) => {
          return oldComments ? [comment, ...oldComments] : undefined;
        },
      );
      return { ...state };
    }

    default:
      return { ...state };
  }
};

export type SocketContextType = {
  socketState: SocketContextState;
  socketDispatch: React.Dispatch<Actions>;
};

export const SocketContext = createContext<SocketContextType>({
  socketState: defaultSocketContextState,
  socketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;
