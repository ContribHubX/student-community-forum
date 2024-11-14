import { IUser } from "./IUser";

export interface IComment {
    id: string,
    content: string,
    createdAt: Date,
    createdBy: IUser
}

export interface ICommentDto {
    content: string,
    createdBy: string,
    threadId: string
}