import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Task } from "@/types";
import { useMutation } from "@tanstack/react-query";

const deleteTask = async (taskId: string): Promise<Task> => {
  const response = await api.delete(`/api/task/${taskId}`);
  return response.data;
};

type DeleteTaskMutationOption = {
  mutationConfig?: MutationConfig<typeof deleteTask>;
};

export const useDeleteTask = ({
  mutationConfig,
}: DeleteTaskMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteTask,
  });
};
