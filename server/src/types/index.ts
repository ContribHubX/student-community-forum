import { IUser } from "@/domain/interfaces/IUser";

export type AuthResponse = {
  user: IUser;
  accessToken: string;
};

export type AuthProvider = "GOOGLE" | "GITHUB";
