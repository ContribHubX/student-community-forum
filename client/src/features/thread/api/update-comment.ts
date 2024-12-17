import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const updateCommentSchema = z.object({
  content: z.string().min(6, "Content must be at least 6 characters"),
});

export type UpdateCommentType = z.infer<typeof updateCommentSchema> & {
  id: string;
  updatedBy: string;
};

const updateComment = async (data: UpdateCommentType) => {
  const response = await api.put(
    `/api/thread/comment/${data.id}`,
    data
  );

  return response.data;
};

type UpdateCommentMutationOption = {
  mutationConfig?: MutationConfig<typeof updateComment>;
};

export const useUpdateComment = ({
  mutationConfig,
}: UpdateCommentMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateComment,
  });
};
