import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createCommunitySchema = z.object({
  communityName: z
    .string()
    .min(3, "Community name must be at least 3 characters"),
  description: z.string().min(6, "Description must be at least 6 characters"),
  banner: z
    .instanceof(File, {
      message: "Attachment must be a valid file",
    })
    .nullable()
    .optional()
    .default(null),
  icon: z
    .instanceof(File, {
      message: "Attachment must be a valid file",
    })
    .nullable()
    .optional()
    .default(null),
});

export type CreateCommunityType = z.infer<typeof createCommunitySchema> & {};

const createCommunity = async (data: FormData) => {
  const response = await api.post("api/community", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

type CreateThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof createCommunity>;
};

export const useCreateCommunity = ({
  mutationConfig,
}: CreateThreadMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createCommunity,
  });
};
