import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Community } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getUserCommunities = async (
  userId: string | undefined,
): Promise<Community[]> => {
  const response = await api.get(`/api/community/join?userId=${userId}`);
  return response.data;
};

export const getUserCommunitiesQueryOptions = (userId: string | undefined) => {
  return queryOptions({
    queryKey: ["user-communities", userId],
    queryFn: () => getUserCommunities(userId),
  });
};

export type getCommunityQueryConfig = {
  userId: string;
  queryConfig?: QueryConfig<typeof getUserCommunities>;
};

export const useGetUserCommunities = (
  { userId, queryConfig }: getCommunityQueryConfig,
) => {
  return useQuery({
    ...getUserCommunitiesQueryOptions(userId),
    ...queryConfig,
  });
};
