import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type FormSchema = z.infer<typeof loginSchema>;

const login = async (data: FormSchema) => {
  const response = await api.post("/api/auth/login", data)
  return response.data;
};

type LoginMutationOption = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = ({
  mutationConfig,
}: LoginMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: login,
  });
};
