import { IUser } from "./IUser";

export interface ICommunity {
  id: string;
  name: string;
  description: string;
  banner: string;
  icon: string;
  createdBy: IUser;
}

export interface ICommunityDto {
  name: string;
  description: string;
  banner: string;
  icon: string;
  createdBy: string;
}

export interface IJoinCommunityDto {
  userId: string, 
  communityId: string
}

export interface ICommunityRule {
  id: string;
  description: string;
}

export interface ICommunityEvent {
  id: string;
  name: string;
  eventDate: Date;
  tags: ICommunityEventTags[];
  createdBy: IUser;
  communityId: string;
}

export interface ICommunityEventDto {
  name: string;
  eventDate: Date;
  tags: ICommunityEventTags[];
  createdBy: string;
  communityId: string;
}

export interface ICommunityEventTags {
  id: string;
  name: string;
  communityEventId: string;
}

