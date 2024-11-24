import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Board } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllBoards = async (userId: string): Promise<Board[]> => {
  const response = await api.get(`/api/board?userId=${userId}`);
  return response.data;
};

export const getBoardsQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ["boards", userId.toString()],
    queryFn: () => getAllBoards(userId),
  });
};

export type getBoardsQueryConfig = {
  userId: string;
  queryConfig?: QueryConfig<typeof getAllBoards>;
};

export const useGetBoards = ({ userId, queryConfig }: getBoardsQueryConfig) => {
  return useQuery({
    ...getBoardsQueryOptions(userId),
    ...queryConfig,
  });
};
