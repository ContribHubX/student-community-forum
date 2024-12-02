import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Todo } from "@/types";
import { useMutation } from "@tanstack/react-query";


export type CreateTodoType = {
    name: string;   
    createdBy: string;
}

const createTodo = async (data: CreateTodoType): Promise<Todo> => {
  const response = await api.post("/api/study-room/todo", data);
  return response.data;
};

type CreateTodoMutationOption = {
  mutationConfig?: MutationConfig<typeof createTodo>;
};

export const useCreateTodo = ({
  mutationConfig,
}: CreateTodoMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createTodo,
  });
};
