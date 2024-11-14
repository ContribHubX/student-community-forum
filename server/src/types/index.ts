import { IUser } from "@/domain/interfaces/IUser";

export type AuthResponse = {
  user: IUser;
  accessToken: string;
};

export type AuthProvider = "GOOGLE" | "GITHUB";

export type UPLOAD_TYPE = "thread" | "comment";

export type ClientEventCallback = (data: object) => void;

export type ThreadNotificationType = 'like' | 'dislike' | 'comment' | 'reply'

export type TaskNotificationType = 'assigned' | 'updated' | 'completed'

export type NotificationType = ThreadNotificationType & TaskNotificationType