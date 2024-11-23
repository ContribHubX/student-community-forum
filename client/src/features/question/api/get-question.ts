import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Question } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getQuestion = async (questionId: string): Promise<Question> => {
  const response = await api.get(`/api/question/${questionId}`);
  return response.data;
};

export const getQuestionQueryOptions = (questionId: string) => {
  return queryOptions({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });
};

export type getQuestionQueryConfig = {
  questionId: string;
  queryConfig?: QueryConfig<typeof getQuestion>;
};

export const useGetQuestion = ({
  questionId,
  queryConfig,
}: getQuestionQueryConfig) => {
  return useQuery({
    ...getQuestionQueryOptions(questionId),
    ...queryConfig,
  });
};
