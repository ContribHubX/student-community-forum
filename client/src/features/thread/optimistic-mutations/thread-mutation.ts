import { QueryClient } from "@tanstack/react-query";
import { Thread, ReactionType } from "@/types";
import { getThreadsQueryOptions } from "../api/get-all-threads";
import { getUserReactionQueryOptions } from "../api/get-reaction";
import { getThreadByIdQueryOptions } from "../api/get-thread";
import { CreateReactionType } from "../api/create-reaction";
import { getThreadsByCommunityQueryOptions } from "@/features/community/api/get-threads";
import { formDataToObject } from "@/utils";

// TODO add js doc

/**
 *
 * @param queryClient
 * @param userId
 * @param thread
 * @returns
 */
export const createReactionMutationConfig = (
  queryClient: QueryClient,
  userId: string,
  thread: Thread,
) => ({
  onMutate: async (newReaction: CreateReactionType) => {
    const userReactionQKey = getUserReactionQueryOptions({
      userId,
      threadId: thread.id,
    }).queryKey;
    const threadReactionsQKey = getThreadByIdQueryOptions(thread.id).queryKey;
    const generalThreadsQKey = getThreadsQueryOptions().queryKey;

    await queryClient.cancelQueries({ queryKey: userReactionQKey });
    await queryClient.cancelQueries({ queryKey: threadReactionsQKey });
    await queryClient.cancelQueries({ queryKey: generalThreadsQKey });

    // Snapshot previous value
    const previousReactions = queryClient.getQueryData(userReactionQKey);

    // Optimistically update cache
    queryClient.setQueryData(
      userReactionQKey,
      (currentReaction: { type: ReactionType } | undefined) => {
        if (!currentReaction) return currentReaction;
        return {
          type:
            userId.toString() === newReaction.userId.toString()
              ? newReaction.type
              : currentReaction.type,
        };
      },
    );

    queryClient.setQueryData(
      threadReactionsQKey,
      (currentThread: Thread | undefined) => {
        if (!currentThread) return currentThread;
        return {
          ...currentThread,
          likeCount:
            newReaction.type === "LIKE"
              ? currentThread.likeCount + 1
              : currentThread.likeCount,
          dislikeCount:
            newReaction.type === "DISLIKE"
              ? currentThread.dislikeCount + 1
              : currentThread.dislikeCount,
        };
      },
    );

    queryClient.setQueryData(
      generalThreadsQKey,
      (currentThreads: Thread[] | undefined) => {
        if (!currentThreads) return currentThreads;
        return currentThreads.map((currentThread) => {
          if (currentThread.id === thread.id) {
            return {
              ...currentThread,
              likeCount:
                newReaction.type === "LIKE"
                  ? currentThread.likeCount + 1
                  : currentThread.likeCount,
              dislikeCount:
                newReaction.type === "DISLIKE"
                  ? currentThread.dislikeCount + 1
                  : currentThread.dislikeCount,
            };
          }
          return currentThread;
        });
      },
    );

    return { previousReactions };
  },
});

/**
 *
 * @param queryClient
 * @returns
 */
export const saveThreadMutationConfig = (
  queryClient: QueryClient,
  thread: Thread,
) => ({
  onMutate: async (saveThread: { threadId: string }) => {
    const generalThreadsQKey = getThreadsQueryOptions().queryKey;

    await queryClient.cancelQueries({ queryKey: generalThreadsQKey });

    // general
    queryClient.setQueryData(
      generalThreadsQKey,
      (currentThreads: Thread[] | undefined) => {
        if (!currentThreads) return currentThreads;
        return currentThreads.map((currentThread) => {
          if (currentThread.id === saveThread.threadId) {
            return { ...currentThread, isSaved: true };
          }
          return currentThread;
        });
      },
    );

    if (thread.communityId) {
      const communityThreadsQKey = getThreadsByCommunityQueryOptions(
        thread.communityId,
      ).queryKey;

      queryClient.setQueryData(
        communityThreadsQKey,
        (currentThreads: Thread[] | undefined) => {
          if (!currentThreads) return currentThreads;
          return currentThreads.map((currentThread) => {
            if (currentThread.id === saveThread.threadId) {
              return { ...currentThread, isSaved: true };
            }
            return currentThread;
          });
        },
      );
    }
  },
});

export const updateThreadMutationConfig = (
  queryClient: QueryClient,
  onSuccessCallback: () => void,
) => ({
  onMutate: async (data: FormData) => {
    const thread = formDataToObject(data) as Thread;

    const generalThreadsQKey = getThreadsQueryOptions().queryKey;

    await queryClient.cancelQueries({ queryKey: generalThreadsQKey });

    queryClient.setQueryData(
      generalThreadsQKey,
      (currentThreads: Thread[] | undefined) => {
        if (!currentThreads) return currentThreads;
        return currentThreads.map((currentThread) => {
          if (currentThread.id === thread.id) {
            return thread;
          }
          return currentThread;
        });
      },
    );

    if (thread.communityId) {
      const communityThreadsQKey = getThreadsByCommunityQueryOptions(
        thread.communityId,
      ).queryKey;

      queryClient.setQueryData(
        communityThreadsQKey,
        (currentThreads: Thread[] | undefined) => {
          if (!currentThreads) return currentThreads;
          return currentThreads.map((currentThread) => {
            if (currentThread.id === thread.id) {
              return thread;
            }
            return currentThread;
          });
        },
      );
    }
  },
  onSuccess: () => {
    onSuccessCallback();
  },
});
