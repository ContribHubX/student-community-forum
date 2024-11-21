import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Comment } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getComments = async (
  threadId: string | undefined,
): Promise<Comment[]> => {
  const response = await api.get(`/api/thread/comment/${threadId}`);
  return response.data;
};

export const getCommentsQueryOptions = (threadId: string | undefined) => {
  return queryOptions({
    queryKey: ["comments", threadId],
    queryFn: () => getComments(threadId),
  });
};

export type getCommentsQueryConfig = {
  threadId: string | undefined;
  queryConfig?: QueryConfig<typeof getComments>;
};

export const useGetThreadComments = ({
  threadId,
  queryConfig,
}: getCommentsQueryConfig) => {
  return useQuery({
    ...getCommentsQueryOptions(threadId),
    ...queryConfig,
  });
};
