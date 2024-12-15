import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Topic } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type CreateFollowType = {
  followerId: string;
  topicId: string;
};

const followTopic = async (data: CreateFollowType): Promise<Topic> => {
  const response = await api.post(
    "/api/topic/follow",
    data,
  );

  return response.data;
};

type CreateFollowMutationOption = {
  mutationConfig?: MutationConfig<typeof followTopic>;
};

export const useFollowTopic = ({
  mutationConfig,
}: CreateFollowMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: followTopic,
  });
};
