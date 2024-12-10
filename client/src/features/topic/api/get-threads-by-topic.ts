import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getThreadsByTopic = async (topicId: string): Promise<Thread[]> => {
  const response = await api.get(`/api/thread/topic/${topicId}`);
  return response.data;
};

export const getThreadsByTopicQueryOptions = (topicId: string) => {
  return queryOptions({
    queryKey: ["thread-topic", topicId],
    queryFn: () => getThreadsByTopic(topicId),
  });
};

export type getThreadsByTopicQueryConfig = {
  topicId: string;
  queryConfig?: QueryConfig<typeof getThreadsByTopic>;
};

export const useGetThreadsByTopic = ({
  topicId,
  queryConfig,
}: getThreadsByTopicQueryConfig) => {
  return useQuery({
    ...getThreadsByTopicQueryOptions(topicId),
    ...queryConfig,
  });
};
