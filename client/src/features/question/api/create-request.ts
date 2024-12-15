import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

export type CreateRequestSchema = {
  questionId: string;
  requestedBy: string;
  requestedTo: string;
};

const createRequest = async (data: CreateRequestSchema) => {
  const response = await api.post(
    "/api/question/request",
    data,
  );

  return response.data;
};

type CreateRequestMutationOption = {
  mutationConfig?: MutationConfig<typeof createRequest>;
};

export const useCreateRequest = ({
  mutationConfig,
}: CreateRequestMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createRequest,
  });
};
