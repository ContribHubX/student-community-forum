import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import {  User } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getMembers = async (
  communityId: string,
): Promise<User[]> => {
  const response = await api.get(`/api/community/members/${communityId}`);
  return response.data;
};

export const getMembersQueryOptions = (communityId: string) => {
  return queryOptions({
    queryKey: ["community-members", communityId],
    queryFn: () => getMembers(communityId),
  });
};

export type getMembersQueryConfig = {
  communityId: string;
  queryConfig?: QueryConfig<typeof getMembers>;
};

export const useGetMembers = ({
  communityId,
  queryConfig,
}: getMembersQueryConfig) => {
  return useQuery({
    ...getMembersQueryOptions(communityId),
    ...queryConfig,
  });
};
