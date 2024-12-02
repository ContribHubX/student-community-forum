import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Board } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type AddBoardMemberType = {
  memberId: string;
  boardId: string;
};

const addBoardMember = async (data: AddBoardMemberType): Promise<Board> => {
  const response = await api.post(
    "http://localhost:3000/api/board/member",
    data,
  );

  return response.data;
};

type AddBoardMemberMutationOption = {
  mutationConfig?: MutationConfig<typeof addBoardMember>;
};

export const useAddBoardMember = ({
  mutationConfig,
}: AddBoardMemberMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: addBoardMember,
  });
};
