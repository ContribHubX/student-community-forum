import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Question } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllQuestions = async (): Promise<Question[]> => {
  const response = await api.get("/api/question");
  return response.data;
};

export const getQuestionsQueryOptions = () => {
  return queryOptions({
    queryKey: ["general-questions"],
    queryFn: () => getAllQuestions(),
  });
};

export type getQuestionsQueryConfig = {
  queryConfig?: QueryConfig<typeof getAllQuestions>;
};

export const useGetQuestions = ({ queryConfig }: getQuestionsQueryConfig) => {
  return useQuery({
    ...getQuestionsQueryOptions(),
    ...queryConfig,
  });
};
