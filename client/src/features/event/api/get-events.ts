import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { CommunityEvent } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getEvents = async (communityId: string): Promise<CommunityEvent[]> => {
  const response = await api.get(`/api/community/event/${communityId}`);
  return response.data;
};

export const getEventsQueryOptions = (communityId: string) => {
  return queryOptions({
    queryKey: ["events", communityId],
    queryFn: () => getEvents(communityId),
  });
};

export type getEventsQueryConfig = {
  communityId: string;
  queryConfig?: QueryConfig<typeof getEvents>;
};

export const useGetEvents = ({
  communityId,
  queryConfig,
}: getEventsQueryConfig) => {
  return useQuery({
    ...getEventsQueryOptions(communityId),
    ...queryConfig,
  });
};
