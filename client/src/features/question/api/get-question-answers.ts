import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getQuestionAnswers = async (questionId: string): Promise<Thread[]> => {
  const response = await api.get(`/api/question/threads/${questionId}`);
  return response.data;
};

export const getQuestionAnswersQueryOptions = (questionId: string) => {
  return queryOptions({
    queryKey: ["question-answers", questionId],
    queryFn: () => getQuestionAnswers(questionId),
  });
};

export type getQuestionAnswersQueryConfig = {
  questionId: string;
  queryConfig?: QueryConfig<typeof getQuestionAnswers>;
};

export const useGetQuestionAnswers = ({
  questionId,
  queryConfig,
}: getQuestionAnswersQueryConfig) => {
  return useQuery({
    ...getQuestionAnswersQueryOptions(questionId),
    ...queryConfig,
  });
};
