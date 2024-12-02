import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Todo } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getTodos = async (userId: string): Promise<Todo[]> => {
  const response = await api.get(`/api/study-room/todo?userId=${userId}`);
  return response.data;
};

export const getTodosQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ["todos", userId.toString()],
    queryFn: () => getTodos(userId),
  });
};

export type getTodosQueryConfig = {
  userId: string
  queryConfig?: QueryConfig<typeof getTodos>;
};

export const useGetTodos = ({ userId, queryConfig }: getTodosQueryConfig) => {
  return useQuery({
    ...getTodosQueryOptions(userId),
    ...queryConfig,
  });
};
