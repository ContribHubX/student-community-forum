import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { User } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getBoardMembers = async (boardId: string): Promise<User[]> => {
  const response = await api.get(`/api/board/member?boardId=${boardId}`);
  return response.data;
};

export const getBoardMembersQueryOptions = (boardId: string) => {
  return queryOptions({
    queryKey: ["board-members", boardId.toString()],
    queryFn: () => getBoardMembers(boardId),
  });
};

export type getBoardMembersQueryConfig = {
  boardId: string;
  queryConfig?: QueryConfig<typeof getBoardMembers>;
};

export const useGetBoardMembers = ({
  boardId,
  queryConfig,
}: getBoardMembersQueryConfig) => {
  return useQuery({
    ...getBoardMembersQueryOptions(boardId),
    ...queryConfig,
  });
};
