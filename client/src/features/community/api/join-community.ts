import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type JoinCommunityType = {
  userId: string;
  threadId: string;
};

const joinCommunity = async (data: any) => {
  const response = await api.post("api/community/join", data, {});
  return response.data;
};

type JoinCommunityMutationOption = {
  mutationConfig?: MutationConfig<typeof joinCommunity>;
};

export const useJoinCommunity = ({
  mutationConfig,
}: JoinCommunityMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: joinCommunity,
  });
};
