import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getThreadById = async (threadId: string | undefined): Promise<Thread> => {
  const response = await api.get(`/api/thread/${threadId}`);
  return response.data;
};

export const getThreadByIdQueryOptions = (threadId: string | undefined) => {
  return queryOptions({
    queryKey: ["thread", threadId],
    queryFn: () => getThreadById(threadId),
  });
};

export type getThreadsQueryConfig = {
  threadId: string | undefined;
  queryConfig?: QueryConfig<typeof getThreadById>;
};

export const useGetThreadByID = ({
  threadId,
  queryConfig,
}: getThreadsQueryConfig) => {
  return useQuery({
    ...getThreadByIdQueryOptions(threadId),
    ...queryConfig,
  });
};
