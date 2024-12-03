import { IStudyRoom } from "@/domain/interfaces/IStudyRoom";
import { IUser } from "@/domain/interfaces/IUser";
import type Client from "@/pubsub/client";

export type AuthResponse = {
  user: IUser;
  accessToken: string;
};

export type ClientEventOptions = { 
  userId: string,
  client: Client
}

export type VideoOptions = {
  id: string;
  title: string;
  thumbnail: string;
};

export type KanbanClientOption =  ClientEventOptions & { boardId: string, user: IUser };

export type KanbanClient = Pick<KanbanClientOption, "client" | "user"> & { color: number };

export type AuthProvider = "GOOGLE" | "GITHUB" | "LOCAL";

export type SocialAuthProvider = Exclude<AuthProvider, "LOCAL">;

export type UPLOAD_TYPE = "thread" | "comment" | "community" | "topic" | "task";

export type ClientEventCallback = (data: object) => void;

export type ThreadNotificationType = 'like' | 'dislike' | 'comment' | 'reply';

export type ThreadReactionType = "LIKE" | "DISLIKE" | "NONE";

export type TaskNotificationType = 'assigned' | 'updated' | 'completed';

export type BoardNotificationType = "added";

export type QuestionRequestNotificationType = "request";

export type NotificationType = ThreadNotificationType & TaskNotificationType & QuestionRequestNotificationType & BoardNotificationType;

export type NotificationEntityType = "task" | "thread" | "question" | "board";

export type BoardStatus = "active" | "finished" | "archived"; 

export type TaskStatusType = "todo" | "doing" | "finished";

export type ChatType = "message" | "indicator";

export type StudyRoomClient = Omit<KanbanClient, "color"> & { room: IStudyRoom };
