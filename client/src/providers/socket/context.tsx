import { createContext } from "react";
import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";

import { getThreadsQueryOptions } from "@/features/thread/api/get-all-threads";
import { getCommentsQueryOptions } from "@/features/thread/api/get-thread-comments";
import { getThreadByIdQueryOptions } from "@/features/thread/api/get-thread";
import { getUserReactionQueryOptions } from "@/features/thread/api/get-reaction";
import { getUsersByQuestionQueryOptions } from "@/features/question/api/get-users-by-question";
import { getPendingRequestQueryOptions } from "@/features/question/api/get-pending-request";
import { getTopicFollowersQueryOptions } from "@/features/topic/api/get-followers";

import { Comment, PendingQuestionRequest, Reaction, ReactionType, Thread, TopicUserFollow, User, Board } from "@/types";
import { getBoardsQueryOptions } from "@/features/workspace/api/get-all-boards";

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
  ADD_NEW_REQUEST,
  ADD_NEW_TOPIC_FOLLOWER,
  ADD_NEW_BOARD,
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
      payload: { currentUserId: string; reaction: Reaction; queryClient: QueryClient };
    }
  | {
      type: OPERATION.UPDATE_SOCKET;
      payload: Socket;
    }
  | {
      type: OPERATION.ADD_NEW_REQUEST;
      payload: { request: PendingQuestionRequest; queryClient: QueryClient };
    }
  | {
      type: OPERATION.ADD_NEW_TOPIC_FOLLOWER;
      payload: { data: TopicUserFollow; queryClient: QueryClient };
    }
  | {
      type: OPERATION.ADD_NEW_BOARD;
      payload: { data: Board; queryClient: QueryClient };
    }


/**
 * Credits: ChatGPT for jsdoc
 * 
 * Reducer function to manage socket-related actions in the state.
 * Handles updates to the socket, adding new threads, comments, and reactions.
 *
 * @param state - The current state of the socket context.
 * @param action - The action dispatched to update the state.
 * @returns Updated state based on the action type.
 */
export const socketReducer = (state: SocketContextState, action: Actions): SocketContextState => {
  switch (action.type) {
    /**
     * Updates the `socket` object in the state.
     * This is used to maintain a reference to the current socket connection.
     *
     * @param action.payload - The new socket object to update in the state.
     */
    case OPERATION.UPDATE_SOCKET:
      return { ...state, socket: action.payload };
    
    /**
     * Adds a new thread to the cached thread list.
     * Updates the query data in the React Query cache for the thread list.
     *
     * @param action.payload.thread - The new thread object to add.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.ADD_NEW_THREAD: {
      const { thread, queryClient } = action.payload;
      
      // TODO this if's statements should be extracted in some helper func para limpyo tan awn yawa!
      if (!thread.communityId && !thread.topicId && !thread.questionId) {
        queryClient.setQueryData(
          getThreadsQueryOptions().queryKey,
          (oldThreads: Thread[] | undefined) => {
            return oldThreads ? [thread, ...oldThreads] : undefined;
          }
        );
      }

      if (thread.questionId) {
        queryClient.setQueryData(
          getUsersByQuestionQueryOptions(thread.questionId).queryKey,
          (oldUsers: User[] | undefined) => {
            return oldUsers ? [...oldUsers, thread.createdBy] : undefined;
          }
        );
      }

      return { ...state };
    }

    /**
     * Adds a new comment to the cached comment list of a specific thread.
     * Updates the query data in the React Query cache for the comment list.
     *
     * @param action.payload.comment - The new comment object to add.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.ADD_NEW_COMMENT: {
      const { comment, queryClient } = action.payload;
      queryClient.setQueryData(
        getCommentsQueryOptions(comment.threadId).queryKey,
        (oldComments: Comment[] | undefined) => {
          if (!oldComments) return [comment]; 

          if (!comment.parentId)
            return [comment, ...oldComments]; 

          // if reply
          return oldComments.map(comm => {
            if(comm.id === comment.parentId) {
              return {
                ...comm,
                replies: [...comm.replies || [], comment]
              }
            }

            return comm;
          })
        }
      );
      return { ...state };
    }

    /**
     * Adds a new reaction (like/dislike) to a thread and updates the user's reaction state.
     * Updates the query data in the React Query cache for both thread details and user reaction.
     *
     * @param action.payload.reaction - The reaction object containing the type and thread ID.
     * @param action.payload.currentUserId - The ID of the current user adding the reaction.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.ADD_NEW_REACTION: {
      const { currentUserId, reaction, queryClient } = action.payload;

      // Update the thread's like and dislike counts
      queryClient.setQueryData(
        getThreadByIdQueryOptions(reaction.threadId).queryKey,
        (currentThread: Thread | undefined) => {
          if (!currentThread) return currentThread;

          return {
            ...currentThread,
            likeCount: reaction.type === "LIKE" 
              ? currentThread.likeCount + 1 
              : currentThread.likeCount,
            dislikeCount: reaction.type === "DISLIKE" 
              ? currentThread.dislikeCount + 1 
              : currentThread.dislikeCount,
          };
        }
      );

      // Update the user's current reaction for the thread
      queryClient.setQueryData(
        getUserReactionQueryOptions({ userId: reaction.userId, threadId: reaction.threadId }).queryKey,
        (currentReaction: { type: ReactionType } | undefined) => {
          if (!currentReaction) return currentReaction;

          return {
            type: currentUserId.toString() === reaction.userId 
              ? reaction.type 
              : currentReaction?.type,
          };
        }
      );

      return { ...state };     
    }

    /**
     * Adds a new pending question request for a specific user and updates the cache.
     * Updates the query data in the React Query cache for the user's pending requests.
     *
     * @param action.payload.request - The pending question request object to be added.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.ADD_NEW_REQUEST: { 
      const { request, queryClient } = action.payload;
      queryClient.setQueryData(
        getPendingRequestQueryOptions(request.requestedTo.id.toString()).queryKey,
        (oldQuestionReq: PendingQuestionRequest[] | undefined) => {
          return oldQuestionReq ? [request, ...oldQuestionReq] : undefined;
        }
      );

      return { ...state };      
    }

    /**
     * Adds a new follower to a topic and updates the followers list in the cache.
     * Updates the query data in the React Query cache for the topic's followers.
     *
     * @param action.payload.user - The user object representing the new follower.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.ADD_NEW_TOPIC_FOLLOWER: { 
      const { data, queryClient } = action.payload;
      queryClient.setQueryData(
        getTopicFollowersQueryOptions(data.topicId.toString()).queryKey,
        (oldUsers: User[] | undefined) => {
          return oldUsers ? [data.user, ...oldUsers] : undefined;
        }
      );

      return { ...state };      
    }
    
    /**
     * Adds a new board to the list of boards and updates the cache.
     * Updates the query data in the React Query cache for the user's boards.
     *
     * @param action.payload.data - The board object representing the new board.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.ADD_NEW_BOARD: { 
      const { data, queryClient } = action.payload;
      queryClient.setQueryData(
        getBoardsQueryOptions(data.createdBy.id.toString()).queryKey,
        (oldBoards: Board[] | undefined) => {
          return oldBoards ? [data, ...oldBoards] : undefined;
        }
      );

      return { ...state };      
    }
    

    /**
     * Default case: Returns the current state if no matching action type is found.
     */
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
