import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Board } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createBoardSchema = z.object({
    name: z.string().min(3, "Content must be at least 6 characters"),
});

export type CreateBoardType = z.infer<typeof createBoardSchema> & {
  createdBy: string;
};

const createBoard = async (data: CreateBoardType): Promise<Board> => {
  const response = await api.post(
    "http://localhost:3000/api/board", data
  );

  return response.data;
};

type CreateBoardMutationOption = {
  mutationConfig?: MutationConfig<typeof createBoard>;
};

export const useCreateBoard = ({
  mutationConfig,
}: CreateBoardMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createBoard,
  });
};
