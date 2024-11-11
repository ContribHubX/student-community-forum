import { IUser } from "./IUser";

export interface ICommunity {
  id: string;
  name: string;
  description: string;
  banner: string;
  profilePicture: string;
  createdBy: IUser;
}

export interface ICommunityDto {
  name: string;
  description: string;
  banner: string;
  profilePicture: string;
  createdBy: IUser;
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

