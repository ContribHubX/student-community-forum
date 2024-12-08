import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Board } from "@/types";
import { useMutation } from "@tanstack/react-query";

const deleteBoard = async (boardId: string): Promise<Board> => {
  const response = await api.delete(`/api/board/${boardId}`);
  return response.data;
};

type DeleteBoardMutationOption = {
  mutationConfig?: MutationConfig<typeof deleteBoard>;
};

export const useDeleteBoard = ({
  mutationConfig,
}: DeleteBoardMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteBoard,
  });
};
