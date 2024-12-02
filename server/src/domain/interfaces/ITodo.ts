import { IUser } from "./IUser";

export interface ITodo {
    id: string;
    name: string;
    isDone: boolean;
    createdAt: Date;
    createdBy: IUser;
}

export interface ITodoDto {
    name: string;   
    createdBy: string;
}

export interface ITodoUpdateDto {
    todoId: string;
    isDone: boolean;
}