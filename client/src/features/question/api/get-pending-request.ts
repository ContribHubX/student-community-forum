import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { PendingQuestionRequest } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getPendingRequest = async (userId: string): Promise<PendingQuestionRequest[]> => {
  const response = await api.get(`/api/question/requested/${userId}`);
  return response.data;
};

export const getPendingRequestQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ["request", userId.toString()],
    queryFn: () => getPendingRequest(userId),
  });
};

export type getPendingRequestQueryConfig = {
  userId: string,
  queryConfig?: QueryConfig<typeof getPendingRequest>;
};

export const useGetPendingRequest = ({ userId, queryConfig }: getPendingRequestQueryConfig) => {
  return useQuery({
    ...getPendingRequestQueryOptions(userId),
    ...queryConfig,
  });
};
