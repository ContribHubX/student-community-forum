import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type DeleteCommentType = {
  commentId: string;
};

const deleteComment = async (data: DeleteCommentType): Promise<void> => {
  const response = await api.delete(`/api/thread/comment/${data.commentId}`);
  return response.data;
};

type DeleteCommentMutationOption = {
  mutationConfig?: MutationConfig<typeof deleteComment>;
};

export const useDeleteComment = ({
  mutationConfig,
}: DeleteCommentMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteComment,
  });
};
