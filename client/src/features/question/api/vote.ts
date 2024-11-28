import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { QuestionVote } from "@/types";
import { useMutation } from "@tanstack/react-query";

const createVote = async (data: QuestionVote) => {
  const response = await api.post(
    "http://localhost:3000/api/question/vote",
    data,
  );

  return response.data;
};

type CreateVoteMutationOption = {
  mutationConfig?: MutationConfig<typeof createVote>;
};

export const useCreateVote = ({
  mutationConfig,
}: CreateVoteMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createVote,
  });
};
