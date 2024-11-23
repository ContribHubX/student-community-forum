import { BoardStatus } from "@/types";
import { IUser } from "./IUser";

export interface IBoard {
    id: string;
    name: string;
    status: BoardStatus;
    createdBy: IUser;
    createdAt: Date;
    updatedAt: Date;
    members: IUser[]; 
}

export interface IBoardDto {
    name: string;
    createdBy: string;
} 

export interface IBoardMember {
    member: IUser;
    board: IBoard;
}

export interface IBoardMemberDto {
    memberId: string;
    boardId: string;
}