import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

const deleteQuestion = async (questionId: string): Promise<void> => {
  const response = await api.delete(
    `/api/question/${questionId}`
  );

  return response.data;
};

type DeleteQuestionMutationOption = {
  mutationConfig?: MutationConfig<typeof deleteQuestion>;
};

export const useDeleteQuestion = ({
  mutationConfig,
}: DeleteQuestionMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteQuestion,
  });
};
