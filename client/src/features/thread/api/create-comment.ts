import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(6, "Content must be at least 6 characters"),
});

export type CreateCommentType = z.infer<typeof createCommentSchema> & {
  createdBy: string | undefined;
};

const createComment = async (data: any) => {
  const response = await api.post(
    "http://localhost:3000/api/thread/comment",
    data,
    {},
  );

  return response.data;
};

type CreateThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof createComment>;
};

export const useCreateComment = ({
  mutationConfig,
}: CreateThreadMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createComment,
  });
};
