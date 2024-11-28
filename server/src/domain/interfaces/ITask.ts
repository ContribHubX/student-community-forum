import { TaskStatusType } from "@/types";
import { IUser } from "./IUser";
import { IBoard } from "./IBoard";

export interface ITask {
    id: string;
    name: string;
    description: string;
    attachment?: string;
    status: TaskStatusType;
    sequence: number;
    createdAt: Date;
    createdBy: IUser;
    assignees: IUser[]; 
    boardId: IBoard;
}

export interface ITaskDto {
    name: string;
    description: string;
    attachment?: string;
    status: TaskStatusType;
    createdBy: string;
    assignees?: IUser[]; 
    boardId: string;
}

export interface ITaskUpdateDto extends ITaskDto {
    taskId: string;
    sequence: number;
}




