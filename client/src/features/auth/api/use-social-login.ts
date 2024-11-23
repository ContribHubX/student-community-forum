import { api } from "@/lib/axios";

export const loginSocialProvider = async (provider: string) => {
  const login: any = await api.get(`/api/auth/url/${provider}`);
  window.location.href = login.data.url;
};
