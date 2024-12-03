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

import { Comment, PendingQuestionRequest, Reaction, ReactionType, Thread, Notification, TopicUserFollow, User, Board, Task, BoardState, RoomState, QuestionVote, QuestionVoteStats, Chat, VideoType } from "@/types";
import { getBoardsQueryOptions } from "@/features/workspace/api/get-all-boards";
import { getTasksQueryOptions } from "@/features/workspace/api/get-all-tasks";import { getVotesQueryOptions } from "@/features/question/api/get-votes";
import { getNotificationQueryOptions } from "@/features/notification/api/get-notifications";
import { getChatsQueryOptions } from "@/features/study-room/api/get-chats";
;

export type SocketContextState = {
  socket: Socket | undefined;
  boards: Record<string, BoardState[]>;
  rooms: Record<string, RoomState>;
};

export const defaultSocketContextState: SocketContextState = {
  socket: undefined,
  boards: {},
  rooms: {}
};

export enum OPERATION {
  UPDATE_SOCKET,
  ADD_NEW_THREAD,
  ADD_NEW_COMMENT,
  ADD_NEW_REACTION,
  ADD_NEW_REQUEST,
  ADD_NEW_TOPIC_FOLLOWER,
  ADD_NEW_BOARD,
  ADD_TASK,
  UPDATE_TASK,
  INITIALIZE_BOARDS,
  UPDATE_USER_POSITION,
  INIT_BOARD_USERS,
  ADD_NEW_USER_TO_BOARD,
  REMOVE_USER_TO_BOARD,
  ADD_QUESTION_VOTE,
  ADD_NEW_NOTIF,
  INIT_ROOM_USERS,
  ADD_ROOM_USER,
  REMOVE_USER_TO_ROOM,
  ADD_ROOM_CHAT,
  PLAY_NEXT_VIDEO
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
  | {
    type: OPERATION.ADD_TASK;
    payload: { data: Task; queryClient: QueryClient };
  }
  | {
    type: OPERATION.UPDATE_TASK;
    payload: { data: Task; queryClient: QueryClient };
  }
  | {
    type: OPERATION.INITIALIZE_BOARDS;
    payload: { data: Board[] };
  }
  | {
    type: OPERATION.UPDATE_USER_POSITION;
    payload: { data: BoardState & {boardId: string} };
  }
  | {
    type: OPERATION.ADD_NEW_USER_TO_BOARD;
    payload: { data: BoardState & {boardId: string} };
  }
  | {
    type: OPERATION.INIT_BOARD_USERS;
    payload: { data: {userEntry: BoardState[], boardId: string }};
  }
  | {
    type: OPERATION.REMOVE_USER_TO_BOARD;
    payload: { user: User, boardId: string };
  }
  | {
    type: OPERATION.ADD_QUESTION_VOTE;
    payload: { data: QuestionVote, queryClient: QueryClient  };
  }
  | {
    type: OPERATION.ADD_NEW_NOTIF;
    payload: { data: Notification, queryClient: QueryClient  };
  }
  | {
    type: OPERATION.INIT_ROOM_USERS;
    payload: { data: RoomState };
  }
  | {
    type: OPERATION.ADD_ROOM_USER;
    payload: { user: User, roomId: string };
  }
  | {
    type: OPERATION.REMOVE_USER_TO_ROOM;
    payload: { user: User, roomId: string };
  }
  | {
    type: OPERATION.ADD_ROOM_CHAT;
    payload: { chat: Chat, queryClient: QueryClient };
  }
  | {
    type: OPERATION.PLAY_NEXT_VIDEO;
    payload: { video: VideoType, roomId: string };
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
      // queryClient.setQueryData(
      //   getCommentsQueryOptions(comment.threadId).queryKey,
      //   (oldComments: Comment[] | undefined) => {
      //     if (!oldComments) return [comment]; 

      //     if (!comment.parentId)
      //       return [comment, ...oldComments]; 

      //     // if reply
      //     return oldComments.map(comm => {
      //       if(comm.id === comment.parentId) {
      //         return {
      //           ...comm,
      //           replies: [...comm.replies || [], comment]
      //         }
      //       }

      //       return comm;
      //     })
      //   }
      // );
      queryClient.setQueryData(
        getCommentsQueryOptions(comment.threadId).queryKey,
        (oldComments: Comment[] | undefined) => {
          if (!oldComments) return [comment]; 

          
          return [comment, ...oldComments]; 

        
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

      // // Update all threads
      // queryClient.setQueryData(
      //   getThreadsQueryOptions().queryKey,
      //   (currentThreads: Thread[] | undefined) => {
      //     if (!currentThreads) return currentThreads;

      //     const updatedThreads = currentThreads.map(thread => {
      //       if (thread.id === reaction.threadId) {
      //         thread.likeCount = reaction.type === "LIKE" 
      //           ? thread.likeCount + 1 
      //           : thread.likeCount

      //         thread.dislikeCount = reaction.type === "DISLIKE" 
      //           ? thread.dislikeCount + 1 
      //           : thread.dislikeCount
      //       }

      //       return thread;
      //     })
          
      //     console.log(updatedThreads.filter(t => t.id === reaction.threadId))

      //     queryClient.invalidateQueries({ queryKey: getThreadsQueryOptions().queryKey });


      //     return [
      //       ...updatedThreads
      //     ];
      //   }
      // );

      queryClient. invalidateQueries({ queryKey: getThreadsQueryOptions().queryKey });

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
     * 
     * @param action.payload.data - The board object representing the new board.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
     case OPERATION.ADD_TASK: { 
      const { data, queryClient } = action.payload;
      queryClient.setQueryData(
        getTasksQueryOptions(data.boardId.toString()).queryKey,
        (oldTask: Task[] | undefined) => {
          return oldTask ? [...oldTask, data] : []
        }
      );

      return { ...state };      
    }
    

    /**
     * 
     * @param action.payload.data - The board object representing the new board.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.UPDATE_TASK: { 
      const { data, queryClient } = action.payload;
      queryClient.setQueryData(
        getTasksQueryOptions(data.boardId.toString()).queryKey,
        (oldTask: Task[] | undefined) => {
          const updatedTask = oldTask?.map(task => task.id === data.id ? data : task);   
          return updatedTask;
        }
      );

      return { ...state };      
    }
    
    /**
     * 
     */
    case OPERATION.INITIALIZE_BOARDS: { 
      const { data } = action.payload; 

      const boards: Record<string, BoardState[]> = data.reduce((acc, board) => {
        acc[board.id] = acc[board.id] ? [...acc[board.id]] : []; 
        return acc;
      }, {} as Record<string, BoardState[]>);
    
      return {
        ...state,
        boards, 
      };
    }

    /**
     * 
     */
    case OPERATION.INIT_BOARD_USERS: { 
      const { data } = action.payload; 

      const updatedBoards = { ...state.boards };
      
      if (!updatedBoards[data.boardId]) {
        updatedBoards[data.boardId] = []; 
      }

      updatedBoards[data.boardId] = data.userEntry.map(entry => ({
        user: entry.user,
        position: {x: 0, y: 0},
        color: entry.color 
      }))

      return {
        ...state,
        boards: updatedBoards, 
      };
    }

    /**
     * 
     */
    case OPERATION.UPDATE_USER_POSITION: { 
      const { data } = action.payload; 

      const updatedBoards = { ...state.boards };

      if (!updatedBoards[data.boardId]) {
        updatedBoards[data.boardId] = []; 
      }

      updatedBoards[data.boardId] = state.boards[data.boardId]?.map(entry => {
        if (entry.user.id.toString() === data.user.id.toString()) {
          return { 
            ...entry, 
            position: { ...data.position }
          };
        }

        return entry;
      });


      return { ...state, boards: updatedBoards };
    }
    /**
     * 
     */
    case OPERATION.ADD_NEW_USER_TO_BOARD: {
      const { data } = action.payload;
    
      const updatedBoards = { ...state.boards };
      
      // console.log("before: " + JSON.stringify(updatedBoards, null, 2));

      if (!updatedBoards[data.boardId]) {
        updatedBoards[data.boardId] = []; 
      }

      const userExists = updatedBoards[data.boardId].some(
        (entry) => entry.user.id === data.user.id
      );

      if (!userExists) {
        updatedBoards[data.boardId] = [...updatedBoards[data.boardId], {
          user: data.user,
          position: { x: 0, y: 0 }, 
          color: data.color, 
        }];
      }
      
      return { ...state, boards: updatedBoards };
    }

    /**
     * 
     */
    case OPERATION.REMOVE_USER_TO_BOARD: { 
      const { user, boardId } = action.payload; 

      const updatedBoards = { ...state.boards };

      if (!updatedBoards[boardId]) {
        updatedBoards[boardId] = []; 
      }

      updatedBoards[boardId] = state.boards[boardId]?.filter(entry => entry.user.id.toString() !== user.id.toString());

      return { ...state, boards: updatedBoards };
    }

    /**
     * 
     */
    case OPERATION.ADD_QUESTION_VOTE: { 
        const { data, queryClient } = action.payload; 
  
        queryClient.setQueryData(
          getVotesQueryOptions({questionId: data.questionId, userId: data.userId}).queryKey,
          (oldVote: QuestionVoteStats | undefined) => {
            
            const updatedVote = {
              ...oldVote,
              upvoteCount: data.vote === "up" 
              ? (oldVote?.upvoteCount || 0) + 1
              : (oldVote?.upvoteCount || 0),
              downvoteCount: data.vote === "up" 
              ? (oldVote?.downvoteCount || 0) + 1
              : (oldVote?.downvoteCount || 0),
              userVote: data.vote

            }
            return updatedVote;
          }
        );

        return {...state};
      }
    
      /**
       * 
       * @param action.payload.data - The board object representing the new board.
       * @param action.payload.queryClient - The React Query client instance to update the cache.
      */
    case OPERATION.ADD_NEW_NOTIF: { 
      const { data, queryClient } = action.payload;
      queryClient.setQueryData(
        getNotificationQueryOptions(data.receiveBy.toString()).queryKey,
        (oldNotif: Notification[] | undefined) => {
          return oldNotif ? [data, ...oldNotif] : []
        }
      );

      return { ...state };      
    }

    /**
      * @param action.payload.data - The room object representing the new board. 
      */
    case OPERATION.INIT_ROOM_USERS: { 
      const { data } = action.payload;
      
      const updateRooms = {...state.rooms};

      if (!updateRooms[data.room.id]) 
        updateRooms[data.room.id] = {} as RoomState;
      
      updateRooms[data.room.id].users = [...data.users];
      updateRooms[data.room.id].room = {...data.room};
      updateRooms[data.room.id].video = {...data.video};

      return { ...state, rooms: updateRooms };      
    }

    
    /**
      * @param action.payload.data - The room object representing the new board. 
      */
    case OPERATION.ADD_ROOM_USER: { 
      const { user, roomId } = action.payload;
      
      const updatedRooms = {...state.rooms};

      if (!updatedRooms[roomId]) 
        updatedRooms[roomId] = {} as RoomState;
      
      const existingUser = updatedRooms[roomId].users.find(current => current.id === user.id)

      if (existingUser) return { ...state, rooms: updatedRooms }; 

      updatedRooms[roomId].users = [...updatedRooms[roomId].users, user];

      return { ...state, rooms: updatedRooms };      
    }

    /**
     * 
     */
    case OPERATION.REMOVE_USER_TO_ROOM: { 
      const { user, roomId } = action.payload; 

      const updatedRooms = { ...state.rooms };

      if (!updatedRooms[roomId]) return {...state};

      updatedRooms[roomId].users = updatedRooms[roomId].users.filter(current => current.id.toString() !== user.id.toString());
      
      return { ...state, rooms: updatedRooms };
    }

    /**
     * 
     */
     case OPERATION.ADD_ROOM_CHAT: { 
      const { chat, queryClient } = action.payload;
      queryClient.setQueryData(
        getChatsQueryOptions(chat.roomId).queryKey,
        (oldChats: Chat[] | undefined) => {
          return oldChats ? [...oldChats, chat] : []
        }
      );

      return { ...state };   
    }

    /**
     * 
     */
    case OPERATION.PLAY_NEXT_VIDEO: { 
      const { video, roomId } = action.payload; 

      const updatedRooms = {...state.rooms};

      updatedRooms[roomId].video = {...video};
      
      return { ...state, rooms: updatedRooms };   
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
