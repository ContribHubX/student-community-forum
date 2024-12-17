import { createContext } from "react";
import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";

import { getThreadsQueryOptions } from "@/features/thread/api/get-all-threads";
import { getCommentsQueryOptions } from "@/features/thread/api/get-thread-comments";
import { getThreadByIdQueryOptions } from "@/features/thread/api/get-thread";
import { getUsersByQuestionQueryOptions } from "@/features/question/api/get-users-by-question";
import { getPendingRequestQueryOptions } from "@/features/question/api/get-pending-request";
import { getTopicFollowersQueryOptions } from "@/features/topic/api/get-followers";

import { Comment, PendingQuestionRequest, Reaction, Thread, Notification, TopicUserFollow, User, Board, Task, BoardState, DiscussionState, RoomState, QuestionVote, QuestionVoteStats, Chat, VideoType, GroupTimerState, Question, GlobalEventState, Argument } from "@/types";
import { getBoardsQueryOptions } from "@/features/workspace/api/get-all-boards";
import { getTasksQueryOptions } from "@/features/workspace/api/get-all-tasks";import { getVotesQueryOptions } from "@/features/question/api/get-votes";
import { getNotificationQueryOptions } from "@/features/notification/api/get-notifications";
import { getChatsQueryOptions } from "@/features/study-room/api/get-chats";
import { getQuestionsQueryOptions } from "@/features/shared/api/get-all-question";
import { getQuestionAnswersQueryOptions } from "@/features/question/api/get-question-answers";
import { getBoardMembersQueryOptions } from "@/features/workspace/api/get-board-members";
import { getCommunityByIdQueryOptions } from "@/features/community/api/get-community";
import { getEventsQueryOptions } from "@/features/event/api/get-events";
import { getThreadsByCommunityQueryOptions } from "@/features/community/api/get-threads";
import { getThreadsByTopicQueryOptions } from "@/features/topic/api/get-threads-by-topic";

export type SocketContextState = {
  socket: Socket | undefined;
  boards: Record<string, BoardState[]>;
  rooms: Record<string, RoomState>;
  discussions: Record<string, DiscussionState>; 
  globalEvent: GlobalEventState | undefined;
};

export const defaultSocketContextState: SocketContextState = {
  socket: undefined,
  boards: {},
  rooms: {},
  discussions: {},
  globalEvent: undefined
};

export enum OPERATION {
  UPDATE_SOCKET,
  ADD_NEW_THREAD,
  UPDATE_THREAD,
  DELETE_THREAD,
  ADD_NEW_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT,
  ADD_NEW_REACTION,
  ADD_NEW_REQUEST,
  ADD_NEW_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  ADD_NEW_TOPIC_FOLLOWER,
  ADD_NEW_BOARD,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  INITIALIZE_BOARDS,
  UPDATE_USER_POSITION,
  INIT_BOARD_USERS,
  ADD_NEW_USER_TO_BOARD,
  ADD_NEW_MEMBER,
  REMOVE_USER_TO_BOARD,
  ADD_QUESTION_VOTE,
  ADD_NEW_NOTIF,
  INIT_ROOM_USERS,
  ADD_ROOM_USER,
  REMOVE_USER_TO_ROOM,
  ADD_ROOM_CHAT,
  PLAY_NEXT_VIDEO,
  SYNC_VIDEO_CLOCK,
  PLAY_VIDEO,
  TIMER_SYNC,
  JOIN_COMMUNITY,
  ADD_COMMUNITY_EVENT,
  EMIT_GLOBAL_EVENT,
  INIT_COMMUNITY_DISCUSSION,
  ADD_DISCUSSION_USER,
  REMOVE_DISCUSSION_USER, 
  ADD_DISCUSSION_ARGUMENT,
  ADD_ARGUMENT_REACTION,
  RESET_REACTED_ARGUMENT,

}

type Actions =
  | {
      type: OPERATION.ADD_NEW_THREAD;
      payload: { thread: Thread; queryClient: QueryClient };
    }
  | {
      type: OPERATION.DELETE_THREAD;
      payload: { thread: Thread; queryClient: QueryClient };
    }

  | {
      type: OPERATION.UPDATE_THREAD;
      payload: { thread: Thread; queryClient: QueryClient };
    }
  | {
      type: OPERATION.ADD_NEW_COMMENT;
      payload: { comment: Comment; queryClient: QueryClient };
    }
  | {
    type: OPERATION.DELETE_COMMENT;
    payload: { threadId: string; queryClient: QueryClient };
  }
  | {
    type: OPERATION.UPDATE_COMMENT;
    payload: { threadId: string; queryClient: QueryClient };
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
      type: OPERATION.ADD_NEW_QUESTION;
      payload: { question: Question; queryClient: QueryClient };
    }
  | {
    type: OPERATION.UPDATE_QUESTION;
    payload: { question: Question; queryClient: QueryClient };
  }
  | {
    type: OPERATION.DELETE_QUESTION;
    payload: { questionId: string; queryClient: QueryClient };
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
    type: OPERATION.DELETE_TASK;
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
    type: OPERATION.ADD_NEW_MEMBER;
    payload: { data: { member: User, board: Board } , queryClient: QueryClient };
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
  | {
    type: OPERATION.SYNC_VIDEO_CLOCK;
    payload: { time: number, roomId: string };
  }
  | {
    type: OPERATION.PLAY_VIDEO;
    payload: { video: VideoType, roomId: string };
  }
  | {
    type: OPERATION.TIMER_SYNC;
    payload: { time: GroupTimerState, roomId: string };
  }
  | {
    type: OPERATION.JOIN_COMMUNITY;
    payload: { communityId: string, queryClient: QueryClient };
  }
  | {
    type: OPERATION.ADD_COMMUNITY_EVENT;
    payload: { communityId: string, queryClient: QueryClient };
  }
  | {
    type: OPERATION.EMIT_GLOBAL_EVENT;
    payload: { data: GlobalEventState };
  }
  | {
    type: OPERATION.INIT_COMMUNITY_DISCUSSION;
    payload: { data: DiscussionState };
  }
  | {
    type: OPERATION.ADD_DISCUSSION_USER;
    payload: { user: User, discussionId: string };
  }
  | {
    type: OPERATION.REMOVE_DISCUSSION_USER;
    payload: { user: User, discussionId: string };
  }
  | {
    type: OPERATION.ADD_DISCUSSION_ARGUMENT;
    payload: { argument: Argument, discussionId: string };
  }
  | {
    type: OPERATION.ADD_ARGUMENT_REACTION;
    payload: { argument: Argument, discussionId: string };
  }
  | {
    type: OPERATION.RESET_REACTED_ARGUMENT;
    payload: { discussionId: string };
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
      if (!thread.topicId && !thread.questionId) {
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

        // for answers
        queryClient.setQueryData(
          getQuestionAnswersQueryOptions(thread.questionId).queryKey,
          (oldThreads: Thread[] | undefined) => {
            return oldThreads ? [thread, ...oldThreads] : undefined;
          }
        );
      }


      if (thread.topicId) {
        queryClient.setQueryData(
          getThreadsByTopicQueryOptions(thread.topicId).queryKey,
          (oldThreads: Thread[] | undefined) => {
            return oldThreads ? [thread, ...oldThreads] : undefined;
          }
        );
      }

      if (thread.communityId) {
        queryClient.setQueryData(
          getThreadsByCommunityQueryOptions(thread.communityId).queryKey,
          (oldThreads: Thread[] | undefined) => {
            return oldThreads ? [thread, ...oldThreads] : undefined;
          }
        );
      }
  
      return { ...state, globalEvent: { emittedBy: thread.createdBy?.id, type: "thread" } };
    }

    /**
     * 
     */
    case OPERATION.DELETE_THREAD: {
      const { thread, queryClient } = action.payload;
      
      // TODO this if's statements should be extracted in some helper func para limpyo tan awn yawa!
      if (!thread.topicId && !thread.questionId) {
        queryClient.invalidateQueries({ queryKey: getThreadsQueryOptions().queryKey })
      }

      if (thread.questionId) {
        queryClient.invalidateQueries({ queryKey: getQuestionAnswersQueryOptions(thread.questionId).queryKey })
      }
      
      if (thread.communityId) {
        queryClient.invalidateQueries({ queryKey:  getThreadsByCommunityQueryOptions(thread.communityId).queryKey  })
      }

      return { ...state };
    }

    case OPERATION.UPDATE_THREAD: {
      const { thread, queryClient } = action.payload;

      if (thread?.communityId) {
        queryClient.invalidateQueries({ queryKey: getThreadsByCommunityQueryOptions(thread.communityId).queryKey })
      }

      if (thread?.questionId) {
        queryClient.invalidateQueries({ queryKey: getQuestionAnswersQueryOptions(thread.questionId).queryKey })
      }

      if (thread?.topicId) {
        queryClient.invalidateQueries({ queryKey: getThreadsByTopicQueryOptions(thread.topicId).queryKey })
      }
      
      queryClient.invalidateQueries({ queryKey: getThreadsQueryOptions().queryKey });

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

          
          return [comment, ...oldComments]; 

        
        }
      );
      return { ...state };
    }

    case OPERATION.DELETE_COMMENT: {
      const { threadId, queryClient } = action.payload;

      queryClient.invalidateQueries({ queryKey: getCommentsQueryOptions(threadId).queryKey }); 

      return { ...state };
    }

    case OPERATION.UPDATE_COMMENT: {
      const { threadId, queryClient } = action.payload;

      queryClient.invalidateQueries({ queryKey: getCommentsQueryOptions(threadId).queryKey }); 

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
      const { reaction, queryClient } = action.payload;

      if (reaction.thread?.communityId) {
        queryClient.invalidateQueries({ queryKey: getThreadsByCommunityQueryOptions(reaction.thread.communityId).queryKey })
      }

      if (reaction.thread?.questionId) {
        queryClient.invalidateQueries({ queryKey: getQuestionAnswersQueryOptions(reaction.thread.questionId).queryKey })
      }

      if (reaction.thread?.topicId) {
        queryClient.invalidateQueries({ queryKey: getThreadsByTopicQueryOptions(reaction.thread.topicId).queryKey })
      }

      queryClient.invalidateQueries({ queryKey: getThreadsQueryOptions().queryKey });
      queryClient.invalidateQueries({ queryKey: getThreadByIdQueryOptions(reaction.thread.id).queryKey });

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
     * 
     */
    case OPERATION.ADD_NEW_QUESTION: { 
      const { question, queryClient } = action.payload;
      const qK = question.topic?.id || undefined;

      if (qK) {
        queryClient.setQueryData(
          getQuestionsQueryOptions(qK).queryKey,
          (oldQuestion: Question[] | undefined) => {
            return oldQuestion ? [question, ...oldQuestion] : undefined;
          }
        );
      } else {
        queryClient.setQueryData(
          getQuestionsQueryOptions().queryKey,
          (oldQuestion: Question[] | undefined) => {
            return oldQuestion ? [question, ...oldQuestion] : undefined;
          }
        );
      }

      return { ...state, globalEvent: { emittedBy: question.createdBy?.id, type: "question" }  };      
    }

    /**
     * 
     */
    case OPERATION.UPDATE_QUESTION: { 
      const { queryClient } = action.payload;
     
      queryClient.invalidateQueries({ queryKey: getQuestionsQueryOptions().queryKey })

      return { ...state };      
    }

     /**
     * 
     */
     case OPERATION.DELETE_QUESTION: { 
      const { queryClient } = action.payload;
     
      queryClient.invalidateQueries({ queryKey: getQuestionsQueryOptions().queryKey })

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
      // queryClient.setQueryData(
      //   getTasksQueryOptions(data.boardId.toString()).queryKey,
      //   (oldTask: Task[] | undefined) => {
      //     const updatedTask = oldTask?.map(task => task.id === data.id ? data : task);   
      //     return updatedTask;
      //   }
      // );

      queryClient.invalidateQueries({ queryKey: getTasksQueryOptions(data.boardId.toString()).queryKey });

      return { ...state };      
    }

    /**
     * 
     * @param action.payload.data - The board object representing the new board.
     * @param action.payload.queryClient - The React Query client instance to update the cache.
     */
    case OPERATION.DELETE_TASK: { 
      const { data, queryClient } = action.payload;
      queryClient.setQueryData(
        getTasksQueryOptions(data.boardId.toString()).queryKey,
        (oldTask: Task[] | undefined) => {
          const updatedTask = oldTask?.filter(task => task.id !== data.id);   
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
     case OPERATION.ADD_NEW_MEMBER: {
      const { data, queryClient } = action.payload;
    
      queryClient.setQueryData(
        getBoardMembersQueryOptions(data.board.id).queryKey,
        (oldMembers: User[] | undefined) => {   
          return oldMembers ? [data.member, ...oldMembers] : undefined;
        }
      );

      return { ...state };   
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
      updateRooms[data.room.id].timer = {...data.timer};

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
     * 
     */
    case OPERATION.PLAY_VIDEO: { 
      const { video, roomId } = action.payload; 

      const updatedRooms = {...state.rooms};

      updatedRooms[roomId].video = {...video};
      
      return { ...state, rooms: updatedRooms };   
    }

    /**
     * 
     */
    case OPERATION.SYNC_VIDEO_CLOCK: { 
      const { time, roomId } = action.payload; 

      const updatedRooms = {...state.rooms};

      updatedRooms[roomId].video = {...updatedRooms[roomId].video, time};
      
      return { ...state, rooms: updatedRooms };   
    }

    /**
     * 
     */
    case OPERATION.TIMER_SYNC: { 
      const { time, roomId } = action.payload; 

      const updatedRooms = {...state.rooms};

      updatedRooms[roomId].timer = {...time};
      
      return { ...state, rooms: updatedRooms };   
    }

    /**
     * 
     */
    case OPERATION.JOIN_COMMUNITY: { 
      const { communityId, queryClient } = action.payload; 
      queryClient.invalidateQueries({ queryKey: getCommunityByIdQueryOptions(communityId).queryKey })
      return { ...state}
    }

    
    /**
     * 
     */
    case OPERATION.ADD_COMMUNITY_EVENT: { 
      const { communityId, queryClient } = action.payload; 
      queryClient.invalidateQueries({ queryKey: getEventsQueryOptions(communityId).queryKey })
      return { ...state}
    }

    /**
     * 
     */
    case OPERATION.EMIT_GLOBAL_EVENT: { 
      const { emittedBy, type } = action.payload.data; 
      return {...state, globalEvent: {emittedBy, type}}
    }

    /**
     * @param action.payload.data - The discussion object representing the community. 
     */
    case OPERATION.INIT_COMMUNITY_DISCUSSION: { 
      const { data } = action.payload;
      
      const updateDiscussions = {...state.discussions};

      if (!updateDiscussions[data.community.id]) 
        updateDiscussions[data.community.id] = {} as DiscussionState;
      
      updateDiscussions[data.community.id].users = [...data.users];
      updateDiscussions[data.community.id].community = {...data.community};
      updateDiscussions[data.community.id].arguments = [...data.arguments];

      return { ...state, discussions: updateDiscussions };      
    }

    /**
     * 
     */
    case OPERATION.ADD_DISCUSSION_ARGUMENT: { 
      const { argument, discussionId } = action.payload;
      
      const updateDiscussions = {...state.discussions};

      if (!updateDiscussions[discussionId]) 
        updateDiscussions[discussionId] = {} as DiscussionState;
      
      updateDiscussions[discussionId].arguments = [argument, 
        ...updateDiscussions[discussionId].arguments
      ];

      updateDiscussions[discussionId].currentArgument = argument;

      return { ...state, discussions: updateDiscussions };      
    }

     /**
     * 
     */
    case OPERATION.ADD_ARGUMENT_REACTION: { 
      const { argument, discussionId } = action.payload;
      
      const updateDiscussions = {...state.discussions};

      if (!updateDiscussions[discussionId]) 
        updateDiscussions[discussionId] = {} as DiscussionState;
      
      updateDiscussions[discussionId].arguments =  
        updateDiscussions[discussionId].arguments.map(arg => {
          if (arg.id === argument.id) 
              return argument;
          return arg;
        })
      

      updateDiscussions[discussionId].currentArgumentModified = argument;

      return { ...state, discussions: updateDiscussions };      
    }

    /**
     * 
     */
    case OPERATION.ADD_DISCUSSION_USER: { 
      const { user, discussionId } = action.payload;
      
      const updateDiscussions = {...state.discussions};

      if (!updateDiscussions[discussionId]) 
        updateDiscussions[discussionId] = {} as DiscussionState;
      
      updateDiscussions[discussionId].users = [user, 
        ...updateDiscussions[discussionId].users
      ];

      return { ...state, discussions: updateDiscussions };      
    }

    /**
     * 
     */
    case OPERATION.REMOVE_DISCUSSION_USER: { 
      const { user, discussionId } = action.payload;
      
      const updateDiscussions = {...state.discussions};

      if (!updateDiscussions[discussionId]) 
        updateDiscussions[discussionId] = {} as DiscussionState;
      
      updateDiscussions[discussionId].users = updateDiscussions[discussionId].users
        .filter(u => u.id.toString() !== user.id.toString());
      

      return { ...state, discussions: updateDiscussions };      
    }


    /**
     * 
     */
    case OPERATION.RESET_REACTED_ARGUMENT: { 
      const { discussionId } = action.payload;
      
      const updateDiscussions = {...state.discussions};

      if (!updateDiscussions[discussionId]) 
        updateDiscussions[discussionId] = {} as DiscussionState;
      
      updateDiscussions[discussionId].currentArgumentModified = undefined;

      return { ...state, discussions: updateDiscussions };      
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
