import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Comment } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getComments = async (id: string | undefined): Promise<Comment[]> => {
  const response = await api.get(`/api/thread/comment/${id}`);
  return response.data;
};

export const getCommentsQueryOptions = (id: string | undefined) => {
  return queryOptions({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
  });
};

export type getCommentsQueryConfig = {
  queryConfig?: QueryConfig<typeof getComments>;
};

export const useGetThreadComments = (
  id: string | undefined,
  { queryConfig }: getCommentsQueryConfig,
) => {
  return useQuery({
    ...getCommentsQueryOptions(id),
    ...queryConfig,
  });
};
