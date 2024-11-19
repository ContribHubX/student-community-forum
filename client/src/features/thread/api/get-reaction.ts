import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { ReactionType } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type CheckReactedDto = {
    userId: string,
    threadId: string
}  

const getUserReaction = async (data: CheckReactedDto): Promise<{type: ReactionType}> => {
  const response = await api.get(`/api/thread/check?threadId=${data.threadId}&userId=${data.userId}`);
  return response.data;
};

export const getUserReactionQueryOptions = (data: CheckReactedDto) => {
  return queryOptions({
    queryKey: ["check", data.threadId],
    queryFn: () => getUserReaction(data),
  });
};

export type getUserReactionQueryConfig = {
  data: CheckReactedDto, 
  queryConfig?: QueryConfig<typeof getUserReaction>;
};

export const useGetUserReaction = ({ data, queryConfig }: getUserReactionQueryConfig) => {
  return useQuery({
    ...getUserReactionQueryOptions(data),
    ...queryConfig,
  });
};
