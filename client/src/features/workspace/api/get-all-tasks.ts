import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Task } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllTasks = async (boardId: string): Promise<Task[]> => {
  const response = await api.get(`/api/task?boardId=${boardId}`);
  return response.data;
};

export const getTasksQueryOptions = (boardId: string) => {
  return queryOptions({
    queryKey: ["task", boardId.toString()],
    queryFn: () => getAllTasks(boardId),
  });
};

export type getTasksQueryConfig = {
  boardId: string;
  queryConfig?: QueryConfig<typeof getAllTasks>;
};

export const useGetTasks = ({ boardId, queryConfig }: getTasksQueryConfig) => {
  return useQuery({
    ...getTasksQueryOptions(boardId),
    ...queryConfig,
  });
};
