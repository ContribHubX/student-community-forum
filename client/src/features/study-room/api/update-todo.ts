import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Todo } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type UpdateTodoType = {
    todoId: string;
    isDone: boolean;
}

const createTodo = async (data: UpdateTodoType): Promise<Todo> => {
  const response = await api.put("/api/study-room/todo", data);
  return response.data;
};

type UpdateTodoMutationOption = {
  mutationConfig?: MutationConfig<typeof createTodo>;
};

export const useUpdateTodo = ({
  mutationConfig,
}: UpdateTodoMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createTodo,
  });
};
