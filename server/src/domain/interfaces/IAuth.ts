import { AuthResponse } from "@/types";
import { IUserRegisterDto, IUserLoginDto, IUser } from "./IUser";

export interface ISocialAuthService {
  generateAuthorizationURL(): Promise<string>;
  handleCallback(code: string, state: string): Promise<AuthResponse>;
  getMyDetails(accessToken: string): Promise<AuthResponse>;
}

export interface ILocalAuthService {
  register(dto: IUserRegisterDto): Promise<void>;
  login(dto: IUserLoginDto): Promise<{ user: IUser; token: string }>;
}

