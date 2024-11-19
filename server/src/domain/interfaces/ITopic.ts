import { IUser } from "./IUser";

export interface ITopic {
    id: string;
    name: string;
    attachment: string;
    createdAt: Date;
    createdBy: IUser;
    followerCount: number;
}

export interface ITopicDto {
    name: string;
    attachment: string;
    createdBy: string;
}

export interface ITopicFollowersDto {
    followerId: string;
    topicId: string;
}