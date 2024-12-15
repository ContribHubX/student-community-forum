import { IUser } from "./IUser";

export interface IArgument {
    id: string;
    content: string;
    createdBy: IUser;
    likeCount: number;
    dislikeCount: number;
    position: { x: number, y: number };
    tags: IArgumentTag[];
    communityId: string;
}
  
export interface IArgumentTag { 
    id: string;
    name: string; 
    argumentId: string;
}
