import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Reaction, ReactionType } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type CreateReactionType = {
  type: ReactionType;
  userId: string;
  threadId: string;
};

const createReaction = async (data: CreateReactionType): Promise<Reaction> => {
  const response = await api.post(
    "/api/thread/react",
    data,
    {},
  );

  return response.data;
};

type CreateReactionMutationOption = {
  mutationConfig?: MutationConfig<typeof createReaction>;
};

export const useCreateReaction = ({
  mutationConfig,
}: CreateReactionMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createReaction,
  });
};
