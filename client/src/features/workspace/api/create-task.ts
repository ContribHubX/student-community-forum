import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { Task, TaskStatusType, User } from "@/types";

export type CreateTaskSchema = {
  name: string;
  description: string;
  attachment?: File | null;
  status: TaskStatusType;
  createdBy: string;
  assignees?: User[];
  boardId: string;
};

const createTask = async (data: FormData): Promise<Task> => {
  const response = await api.post(`/api/task/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

type CreateTaskMutationOption = {
  mutationConfig?: MutationConfig<typeof createTask>;
};

export const useCreateTask = ({ mutationConfig }: CreateTaskMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createTask,
  });
};
