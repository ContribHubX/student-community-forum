import { AuthResponse } from "@/types";

export interface IAuthService {
  generateAuthorizationURL(): Promise<string>;
  handleCallback(code: string, state: string): Promise<AuthResponse>;
  getMyDetails(accessToken: string): Promise<AuthResponse>;
}
