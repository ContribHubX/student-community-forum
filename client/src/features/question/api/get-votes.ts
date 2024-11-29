import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { QuestionVoteStats } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type GetVotesSchema = {
  userId: string;
  questionId: string;
};

const getVotes = async ({
  userId,
  questionId,
}: GetVotesSchema): Promise<QuestionVoteStats> => {
  const response = await api.get(
    `/api/question/vote?questionId=${questionId}&userId=${userId}`,
  );
  return response.data;
};

export const getVotesQueryOptions = (data: GetVotesSchema) => {
  return queryOptions({
    queryKey: ["question-votes", data.questionId],
    queryFn: () => getVotes(data),
  });
};

export type getVotesQueryConfig = {
  data: GetVotesSchema;
  queryConfig?: QueryConfig<typeof getVotes>;
};

export const useGetVotes = ({ data, queryConfig }: getVotesQueryConfig) => {
  return useQuery({
    ...getVotesQueryOptions(data),
    ...queryConfig,
  });
};
