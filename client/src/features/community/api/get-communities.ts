import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { CommunityWithMembers } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getCommunities = async (
): Promise<CommunityWithMembers[]> => {
  const response = await api.get(`/api/community`);
  return response.data;
};

export const getCommunitiesQueryOptions = () => {
  return queryOptions({
    queryKey: ["communities"],
    queryFn: () => getCommunities(),
  });
};

export type getCommunitiesQueryConfig = {
  queryConfig?: QueryConfig<typeof getCommunities>;
};

export const useGetCommunities = (
  { queryConfig }: getCommunitiesQueryConfig,
) => {
  return useQuery({
    ...getCommunitiesQueryOptions(),
    ...queryConfig,
  });
};
