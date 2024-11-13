import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllThreads = async (): Promise<Thread[]> => {
  const response = await api.get("/api/thread");
  return response.data;
};

export const getThreadsQueryOptions = () => {
  return queryOptions({
    queryKey: ["general-threads"],
    queryFn: () => getAllThreads(),
  });
};

export type getThreadsQueryConfig = {
  queryConfig?: QueryConfig<typeof getAllThreads>;
};

export const useGetThreads = ({ queryConfig }: getThreadsQueryConfig) => {
  return useQuery({
    ...getThreadsQueryOptions(),
    ...queryConfig,
  });
};
