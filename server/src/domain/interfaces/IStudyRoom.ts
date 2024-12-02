import { IUser } from "./IUser";

export interface IStudyRoom {
    id: string;
    name: string;
    description: string;
    attachment: string;
    createdAt: Date;
    createdBy: IUser;
}

export interface IStudyRoomDto {
    name: string;
    description: string;
    attachment: string;
    createdBy: string;
}