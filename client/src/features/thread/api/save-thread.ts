import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getThreadByIdQueryOptions } from "./get-thread";
import { Thread } from "@/types";
import { getThreadsQueryOptions } from "./get-all-threads";

export type SavedThreadType = {
  userId: string;
  threadId: string;
};

const saveThread = async (data: SavedThreadType): Promise<{ userId: string, threadId: string }> => {
  const response = await api.post(
    "/api/thread/save",
    data
  );

  return response.data;
};

type SavedThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof saveThread>;
};

export const useSavedThread = ({
  mutationConfig,
}: SavedThreadMutationOption) => {
  const queryClient = useQueryClient();
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    onSuccess: ({ threadId }) => {
        queryClient.setQueryData(
            getThreadByIdQueryOptions(threadId).queryKey,
            (oldThread: Thread | undefined) => {
                return oldThread ? { ...oldThread, isSaved: true } : undefined;
            }
        )

        queryClient.setQueryData(
            getThreadsQueryOptions().queryKey, 
            (oldThreads: Thread[] | undefined) => {
                return oldThreads
                ? oldThreads.map((thread) =>
                    thread.id === threadId ? { ...thread, isSaved: true } : thread
                    )
                : oldThreads;
        });
    },
    mutationFn: saveThread,
  });
};
