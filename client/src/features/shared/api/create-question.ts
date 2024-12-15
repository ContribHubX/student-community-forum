import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createQuestionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(6, "Content must be at least 6 characters"),
  attachment: z
    .instanceof(File, {
      message: "Attachment must be a valid file",
    })
    .nullable()
    .optional()
    .default(null),
});

export type CreateQuestionType = z.infer<typeof createQuestionSchema> & {
  createdBy: string;
  topicId: string | null;
};

const createQuestion = async (data: CreateQuestionType) => {
  const response = await api.post("/api/question", data);

  return response.data;
};

type CreateQuestionMutationOption = {
  mutationConfig?: MutationConfig<typeof createQuestion>;
};

export const useCreateQuestion = ({
  mutationConfig,
}: CreateQuestionMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createQuestion,
  });
};
