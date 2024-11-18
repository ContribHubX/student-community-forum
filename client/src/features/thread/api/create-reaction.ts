import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Reaction } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type CreateThreadType = {
  type: Reaction;
  createdBy: string;
  threadId: string;
};

const createReaction = async (data: any) => {
  const response = await api.post(
    "http://localhost:3000/api/thread/react",
    data,
    {},
  );

  return response.data;
};

type CreateThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof createReaction>;
};

export const useCreateReaction = ({
  mutationConfig,
}: CreateThreadMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createReaction,
  });
};
