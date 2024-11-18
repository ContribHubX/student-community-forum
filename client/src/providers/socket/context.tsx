import { Comment, Reaction, Thread } from "@/types";
import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { getThreadsQueryOptions } from "@/features/thread/api/get-all-threads";
import { createContext } from "react";
import { getThreadByIdQueryOptions } from "@/features/thread/api/get-thread";

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
  ADD_NEW_REACTION,
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
  | {
      type: OPERATION.ADD_NEW_REACTION;
      payload: { reaction: Reaction; queryClient: QueryClient };
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
      comment.replies = [];
      if (comment.parentId) {
        queryClient.setQueryData(
          ["comments", comment.threadId],
          (oldComments: Comment[] | undefined) => {
            return oldComments?.map((existingComment) => {
              if (existingComment.id === comment.parentId) {
                return {
                  ...existingComment,
                  replies: [...existingComment.replies, comment],
                };
              }
              return existingComment;
            });
          },
        );
      } else {
        queryClient.setQueryData(
          ["comments", comment.threadId],
          (oldComments: Comment[] | undefined) => {
            return oldComments ? [comment, ...oldComments] : undefined;
          },
        );
      }
      return { ...state };
    }

    case OPERATION.ADD_NEW_REACTION: {
      const { reaction, queryClient } = action.payload;
      console.log(reaction);
      queryClient.setQueryData(
        getThreadByIdQueryOptions(reaction.threadId).queryKey,
        (thread: Thread | undefined) => {
          console.log("thread: ", thread);
          if (thread) {
            // Return a new thread object with the incremented likeCount
            if (reaction.type === "LIKE") {
              return { ...thread, likeCount: thread.likeCount + 1 };
            }
            return { ...thread, dislikeCount: thread.dislikeCount + 1 };
          }
          return thread;
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
