import { AuthProvider } from "@/types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string | null;
  provider: AuthProvider;
  attachment: string | null;
}

export interface IUserRegisterDto {
  name: string;
  email: string;
  password: string;
  attachment: string | null;
}

export interface IUserFullRegisterDto {
  id: string;
  name: string;
  email: string;
  password: string | null; 
  provider: AuthProvider;
  attachment: string | null;
}

export interface IUserLoginDto {
  email: string;
  password: string; 
}

