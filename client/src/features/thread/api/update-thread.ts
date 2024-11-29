import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const updateThreadSchema = z.object({
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

export type UpdateThreadType = z.infer<typeof updateThreadSchema> & {
  createdBy: string;
  threadId: string;
};

const updateThread = async (data: FormData) => {
  const response = await api.put("http://localhost:3000/api/thread", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

type CreateThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof updateThread>;
};

export const useUpdateThread = ({
  mutationConfig,
}: CreateThreadMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateThread,
  });
};
