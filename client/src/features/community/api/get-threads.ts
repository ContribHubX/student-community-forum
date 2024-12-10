import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getThreads = async (
 communityId: string
): Promise<Thread[]> => {
  const response = await api.get(`/api/thread/community/${communityId}`);
  return response.data;
};

export const getThreadsByCommunityQueryOptions = (communityId: string) => {
  return queryOptions({
    queryKey: ["community-threads", communityId],
    queryFn: () => getThreads(communityId),
  });
};

export type getThreadsQueryConfig = {
  communityId: string,
  queryConfig?: QueryConfig<typeof getThreads>;
};

export const useGetThreadsByCommunity = (
  { communityId, queryConfig }: getThreadsQueryConfig,
) => {
  return useQuery({
    ...getThreadsByCommunityQueryOptions(communityId),
    ...queryConfig,
  });
};
