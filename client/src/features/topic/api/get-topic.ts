import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Topic } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getTopic = async (topicId: string): Promise<Topic> => {
  const response = await api.get(`/api/topic/${topicId}`);
  return response.data;
};

export const getTopicQueryOptions = (topicId: string) => {
  return queryOptions({
    queryKey: ["topic", topicId],
    queryFn: () => getTopic(topicId),
  });
};

export type getTopicQueryConfig = {
  topicId: string;
  queryConfig?: QueryConfig<typeof getTopic>;
};

export const useGetTopic = ({ topicId, queryConfig }: getTopicQueryConfig) => {
  return useQuery({
    ...getTopicQueryOptions(topicId),
    ...queryConfig,
  });
};
