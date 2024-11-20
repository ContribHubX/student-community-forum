import { IUser } from "./IUser";

export interface IComment {
    id: string,
    content: string,
    threadId: string,
    parentId: string | null,
    createdAt: Date,
    createdBy: IUser,
    replies: IComment[] | []
}

export interface ICommentDto {
    content: string,
    createdBy: string,
    threadId: string,
    parentId: string | null,
}