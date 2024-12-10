import { AuthProvider } from "@/types";

export function parseAuthToken(rawToken: string) {
  const provider = rawToken.split("_")[0] as AuthProvider;
  const accessToken = rawToken.substring(provider.length + 1);

  return { provider, accessToken };
}
