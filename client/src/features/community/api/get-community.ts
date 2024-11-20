import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { CommunityWithMembers } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getCommunityById = async (
  id: string | undefined,
): Promise<CommunityWithMembers> => {
  const response = await api.get(`/api/community/${id}`);
  return response.data;
};

export const getCommunityByIdQueryOptions = (id: string | undefined) => {
  return queryOptions({
    queryKey: ["community", id],
    queryFn: () => getCommunityById(id),
  });
};

export type getCommunityQueryConfig = {
  queryConfig?: QueryConfig<typeof getCommunityById>;
};

export const useGetCommunityById = (
  id: string | undefined,
  { queryConfig }: getCommunityQueryConfig,
) => {
  return useQuery({
    ...getCommunityByIdQueryOptions(id),
    ...queryConfig,
  });
};
