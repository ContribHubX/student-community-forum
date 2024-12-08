import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Topic } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getTopicsQueryOptions } from "./get-all-topics";

export const createTopicSchema = z.object({
    name: z.string().min(2, {
        message: "Topic name must be at least 2 characters.",
      }),
    attachment: z.instanceof(File).optional(),
});

export type CreateTopicType = z.infer<typeof createTopicSchema> & {
  createdBy: string;
};

const createTopic = async (data: CreateTopicType): Promise<Topic> => {
  const response = await api.post("/api/topic", data, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

type CreateTopicMutationOption = {
  mutationConfig?: MutationConfig<typeof createTopic>;
};

export const useCreateTopic = ({
  mutationConfig,
}: CreateTopicMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  const queryClient = useQueryClient();

  return useMutation({
    ...restConfig,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getTopicsQueryOptions().queryKey })
    },
    mutationFn: createTopic,
  });
};
