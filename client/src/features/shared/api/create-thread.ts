import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Thread } from "@/types";
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

const createThread = async (data: FormData): Promise<Thread> => {
  const response = await api.post("/api/thread", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
