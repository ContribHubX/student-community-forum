import { IUser } from "./IUser";

export interface IThread {
  id: string;
  title: string;
  content: string;
  attachment: string;
  createdBy: IUser;
  createdAt: Date;
  communityId: string | null;
  tags?: IThreadTag[];
  topicId: string | null;
  isSaved: boolean;
  questionId: string | null;
}

export interface IThreadTag {
  id: string;
  name: string;
  threadId: string;
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
  tags?: IThreadTag[];
  communityId: string | null;
  topicId: string | null;
  questionId: string | null;
}

export interface IThreadUpdateDto extends IThreadDto {
  threadId: string
}

export interface IThreadDeleteDto {
  userId: string;
  threadId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISaveThreadDto extends IThreadDeleteDto {}

export interface IThreadReactionDto {
  threadId: string,
  userId: string,
  type: "LIKE" | "DISLIKE"
}

export interface IAlreadyReactedDto {
  userId: string,
  threadId: string 
}

export interface IGetByTopicDto {
  userId: string;
  topicId: string;
}

export interface IGetByCommunityDto {
  userId: string;
  communityId: string;
}

export interface IGetByQuestionDto {
  userId: string;
  questionId: string;
}

export interface IGetByIdDto {
  userId: string;
  threadId: string;
}