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
  description: string;
  eventDate: Date;
}

