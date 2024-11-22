import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Question } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllQuestions = async (topicId?: string): Promise<Question[]> => {
  const queryParam = topicId ? `topicId=${topicId}` : 'topicId=';
  const response = await api.get(`/api/question?${queryParam }`);
  return response.data;
};

export const getQuestionsQueryOptions = (topicId?: string) => {
  return queryOptions({
    queryKey: ["questions", topicId?.toString()],
    queryFn: () => getAllQuestions(),
  });
};

export type getQuestionsQueryConfig = {
  topicId?: string,
  queryConfig?: QueryConfig<typeof getAllQuestions>;
};

export const useGetQuestions = ({ topicId, queryConfig }: getQuestionsQueryConfig) => {
  return useQuery({
    ...getQuestionsQueryOptions(topicId),
    ...queryConfig,
  });
};
