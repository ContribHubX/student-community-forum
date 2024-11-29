import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Notification } from "@/types";

const getNotification = async (
  userId: string | undefined,
): Promise<Notification[]> => {
  const response = await api.get(`/api/notif/${userId}`);
  return response.data;
};

export const getNotificationQueryOptions = (userId: string | undefined) => {
  return queryOptions({
    queryKey: ["notification", userId?.toString()],
    queryFn: () => getNotification(userId),
  });
};

export type getNotificationQueryConfig = {
  userId: string | undefined;
  queryConfig?: QueryConfig<typeof getNotification>;
};

export const useGetNotifications = ({
  userId,
  queryConfig,
}: getNotificationQueryConfig) => {
  return useQuery({
    ...getNotificationQueryOptions(userId),
    ...queryConfig,
  });
};