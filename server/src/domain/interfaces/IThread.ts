import { IUser } from "./IUser";

export interface IThread {
  id: string;
  title: string;
  content: string;
  attachment: string;
  createdBy: IUser;
  createdAt: Date;
  communityId: string | null;
  topicId: string | null;
  questionId: string | null;
}

export interface IThreadFull extends IThread {
  likeCount: number,
  dislikeCount: number,
  commentCount: number | undefined
}

export interface IThreadReaction {
  id: string,
  threadId: string,
  userId: string,
  type: "LIKE" | "DISLIKE", 
  createdAt: Date
}


export interface IThreadDto {
  title: string;
  content: string;
  attachment: string;
  createdBy: string;
  communityId: string | null;
  topicId: string | null;
  questionId: string | null;
}

export interface IThreadReactionDto {
  threadId: string,
  userId: string,
  type: "LIKE" | "DISLIKE"
}

export interface IAlreadyReactedDto {
  userId: string,
  threadId: string 
}
