import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createThreadSchema = z.object({
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

export type CreateThreadType = z.infer<typeof createThreadSchema> & {
  createdBy: string;
};

const createThread = async (data: any) => {
  const response = await api.post(
    "http://localhost:3000/api/thread/create",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

type CreateThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof createThread>;
};

export const useCreateThread = ({
  mutationConfig,
}: CreateThreadMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createThread,
  });
};