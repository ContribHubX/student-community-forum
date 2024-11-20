import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Thread } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getNotification = async (
  userId: string | undefined,
): Promise<Thread[]> => {
  const response = await api.get(`/api/notif/${userId}`);
  return response.data;
};

export const getNotificationQueryOptions = (userId: string | undefined) => {
  return queryOptions({
    queryKey: ["notification"],
    queryFn: () => getNotification(userId),
  });
};

export type getNotificationQueryConfig = {
  userId: string | undefined;
  queryConfig?: QueryConfig<typeof getNotification>;
};

export const useGetNotification = ({
  userId,
  queryConfig,
}: getNotificationQueryConfig) => {
  return useQuery({
    ...getNotificationQueryOptions(userId),
    ...queryConfig,
  });
};
