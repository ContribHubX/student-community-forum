import { AuthProvider } from "@/types";

export function parseAuthToken(rawToken: string) {
  //console.log("raw token: " + rawToken)
  const provider = rawToken.split("_")[0] as AuthProvider;
  const accessToken = rawToken.substring(provider.length + 1);

  // console.log("prov: " + provider);
  // console.log("token: " + accessToken);

  return { provider, accessToken };
}
