import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Chat, ChatType } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type CreateChatType = {
    type: ChatType; 
    roomId: string;    
    message : string;   
    createdBy: string;
}

const createChat = async (data: CreateChatType): Promise<Chat> => {
  const response = await api.post("/api/study-room/chat", data);
  return response.data;
};

type CreateChatMutationOption = {
  mutationConfig?: MutationConfig<typeof createChat>;
};

export const useCreateChat = ({
  mutationConfig,
}: CreateChatMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createChat,
  });
};
