import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getThreadById = async (id: string | undefined): Promise<Thread> => {
  const response = await api.get(`/api/thread/${id}`);
  return response.data;
};

export const getThreadByIdQueryOptions = (id: string | undefined) => {
  return queryOptions({
    queryKey: ["thread", id],
    queryFn: () => getThreadById(id),
  });
};

export type getThreadsQueryConfig = {
  queryConfig?: QueryConfig<typeof getThreadById>;
};

export const useGetThreadByID = (
  id: string | undefined,
  { queryConfig }: getThreadsQueryConfig,
) => {
  return useQuery({
    ...getThreadByIdQueryOptions(id),
    ...queryConfig,
  });
};