import { AuthProvider, SocialAuthProvider } from "@/types";

export function parseAuthToken(rawToken: string) {
  const provider = rawToken.split("_")[0] as SocialAuthProvider;
  const accessToken = rawToken.substring(provider.length + 1);

  return { provider, accessToken };
}
