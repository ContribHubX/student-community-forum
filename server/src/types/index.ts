import { IUser } from "@/domain/interfaces/IUser";

export type AuthResponse = {
  user: IUser;
  accessToken: string;
};

export type AuthProvider = "GOOGLE" | "GITHUB";

export type UPLOAD_TYPE = "thread" | "comment";
