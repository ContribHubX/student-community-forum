import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  attachment: z.custom<File>((file) => file instanceof File, {
    message: "Attachment must be a valid file.",
  }),
});

export type FormSchema = z.infer<typeof registerSchema>;

const register = async (data: FormData) => {
  const response = await api.post("/api/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

type RegisterMutationOption = {
  mutationConfig?: MutationConfig<typeof register>;
};

export const useRegister = ({ mutationConfig }: RegisterMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: register,
  });
};
