import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Board } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getSharedBoards = async (userId: string): Promise<Board[]> => {
  const response = await api.get(`/api/board/shared?userId=${userId}`);
  return response.data;
};

export const getSharedBoardsQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ["shared", userId.toString()],
    queryFn: () => getSharedBoards(userId),
  });
};

export type getSharedBoardsQueryConfig = {
  userId: string;
  queryConfig?: QueryConfig<typeof getSharedBoards>;
};

export const useGetSharedBoards = ({ userId, queryConfig }: getSharedBoardsQueryConfig) => {
  return useQuery({
    ...getSharedBoardsQueryOptions(userId),
    ...queryConfig,
  });
};
