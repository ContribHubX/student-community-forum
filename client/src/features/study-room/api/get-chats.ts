import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Chat } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getChats = async (roomId: string): Promise<Chat[]> => {
  const response = await api.get(`/api/study-room/${roomId}/chats`);
  return response.data;
};

export const getChatsQueryOptions = (roomId: string) => {
  return queryOptions({
    queryKey: ["chats", roomId],
    queryFn: () => getChats(roomId),
  });
};

export type getChatsQueryConfig = {
  roomId: string
  queryConfig?: QueryConfig<typeof getChats>;
};

export const useGetChats = ({ roomId, queryConfig }: getChatsQueryConfig) => {
  return useQuery({
    ...getChatsQueryOptions(roomId),
    ...queryConfig,
  });
};
