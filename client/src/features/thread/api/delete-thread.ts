import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type DeleteThreadType = {
  userId: string;
  threadId: string;
};

const deleteThread = async (data: DeleteThreadType): Promise<void> => {
  const response = await api.delete(
    `/api/thread?threadId=${data.threadId}&userId=${data.userId}`,
  );
  return response.data;
};

type CreateThreadMutationOption = {
  mutationConfig?: MutationConfig<typeof deleteThread>;
};

export const useDeleteThread = ({
  mutationConfig,
}: CreateThreadMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteThread,
  });
};
