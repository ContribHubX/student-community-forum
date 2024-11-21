import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { User } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getUsersByQuestion = async (questionId: string): Promise<User[]> => {
  const response = await api.get(`/api/question/users/${questionId}`);
  return response.data;
};

export const getUsersByQuestionQueryOptions = (questionId: string) => {
  return queryOptions({
    queryKey: ["users", questionId],
    queryFn: () => getUsersByQuestion(questionId),
  });
};

export type getUsersByQuestionQueryConfig = {
  questionId: string,
  queryConfig?: QueryConfig<typeof getUsersByQuestion>;
};

export const useGetUsersByQuestion = ({ questionId, queryConfig }: getUsersByQuestionQueryConfig) => {
  return useQuery({
    ...getUsersByQuestionQueryOptions(questionId),
    ...queryConfig,
  });
};
