import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

import { Task, User } from "@/types";
import { z } from "zod";
import { objectToFormData } from "@/utils";

export const updateTaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  attachment: z.string().optional(),
  status: z.enum(["todo", "doing", "finished"], {
    invalid_type_error: "Status must be one of: todo, doing, finished",
  }),
  createdBy: z.string().min(1, "Creator ID is required"),
  boardId: z.string().min(1, "Board ID is required"),
  sequence: z
    .number()
    .int()
    .nonnegative("Sequence must be a non-negative integer"),
});

export type UpdateTaskType = z.infer<typeof updateTaskSchema> & {
  assingnees: User[];
  isDragUpdate: boolean;
};

const updateTask = async (data: UpdateTaskType): Promise<Task> => {
  let response;
  if (data.isDragUpdate) {
    response = await api.put(`/api/task/${data.taskId}`, data);
  } else {
    response = await api.put(
      `/api/task/${data.taskId}`,
      objectToFormData(data),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  return response.data;
};

type UpdateTaskMutationOption = {
  mutationConfig?: MutationConfig<typeof updateTask>;
};

export const useUpdateTask = ({ mutationConfig }: UpdateTaskMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateTask,
  });
};
