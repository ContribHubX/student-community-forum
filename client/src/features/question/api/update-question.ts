import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type UpdateQuestionType =  {
  id: string;
  title: string;
  content: string;  
  topicId: string | null;
};


const updateQuestion = async (data: UpdateQuestionType) => {
  const response = await api.put(
    `/api/question/${data.id}`,
    data,
  );

  return response.data;
};

type UpdateQuestionMutationOption = {
  mutationConfig?: MutationConfig<typeof updateQuestion>;
};

export const useUpdateQuestion = ({
  mutationConfig,
}: UpdateQuestionMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateQuestion,
  });
};
