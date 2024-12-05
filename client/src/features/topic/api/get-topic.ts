import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Topic } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type GetTopicSchema = {
  topicId: string;
  userId: string;
};

const getTopic = async (data: GetTopicSchema): Promise<Topic> => {
  const response = await api.get(
    `/api/topic/${data.topicId}?userId=${data.userId}`,
  );
  return response.data;
};

export const getTopicQueryOptions = (data: GetTopicSchema) => {
  return queryOptions({
    queryKey: ["topic", data.topicId],
    queryFn: () => getTopic(data),
  });
};

export type getTopicQueryConfig = {
  data: GetTopicSchema;
  queryConfig?: QueryConfig<typeof getTopic>;
};

export const useGetTopic = ({ data, queryConfig }: getTopicQueryConfig) => {
  return useQuery({
    ...getTopicQueryOptions(data),
    ...queryConfig,
  });
};
