import { IUser } from "./IUser";

export interface IQuestion {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    createdBy: IUser;
}

export interface IQuestionCreation extends IQuestion {
    requestedTo: string
}

export interface IQuestionRequest {
    requestedBy: IUser,
    requestedTo: IUser,
    question: IQuestion
}

export interface IQuestionDto {
    title: string;
    content: string;
    createdBy: string;
    topicId: string | null
}

export interface IQuestionRequestDto {
    questionId: string;
    requestedBy: string;
    requestedTo: string;
}