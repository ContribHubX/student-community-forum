import { ChatType } from "@/types";
import { IUser } from "./IUser";

export interface IChat {
    id: string;
    message : string;
    type: ChatType;
    roomId: string;
    createdAt: Date;
    createdBy: IUser;
}

export interface IChatDto {
    type: ChatType; 
    roomId: string;    
    message : string;   
    createdBy: string;
}



