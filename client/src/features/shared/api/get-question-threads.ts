import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getQuestionThreads = async (questionId: string): Promise<Thread[]> => {
  const response = await api.get(`/api/question/threads/${questionId}`);
  return response.data;
};

export const getQuestionThreadsQueryOptions = (questionId: string) => {
  return queryOptions({
    queryKey: ["question-threads", questionId],
    queryFn: () => getQuestionThreads(questionId),
  });
};

export type getQuestionThreadsQueryConfig = {
  questionId: string,
  queryConfig?: QueryConfig<typeof getQuestionThreads>;
};

export const useGetQuestionThreads = ({ questionId, queryConfig }: getQuestionThreadsQueryConfig) => {
  return useQuery({
    ...getQuestionThreadsQueryOptions(questionId),
    ...queryConfig,
  });
};
