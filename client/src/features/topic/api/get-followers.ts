import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { User } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getTopicFollowers = async (topicId: string): Promise<User[]> => {
  const response = await api.get(`/api/topic/followers/${topicId}`);
  return response.data;
};

export const getTopicFollowersQueryOptions = (topicId: string) => {
  return queryOptions({
    queryKey: ["topic-followers", topicId],
    queryFn: () => getTopicFollowers(topicId),
  });
};

export type getTopicFollowersQueryConfig = {
  topicId: string,
  queryConfig?: QueryConfig<typeof getTopicFollowers>;
};

export const useGetTopicFollowers = ({ topicId, queryConfig }: getTopicFollowersQueryConfig) => {
  return useQuery({
    ...getTopicFollowersQueryOptions(topicId),
    ...queryConfig,
  });
};
