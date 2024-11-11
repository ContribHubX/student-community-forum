import { IUser } from "./IUser";

export interface IThread {
  id: string;
  title: string;
  content: string;
  attachment: string;
  createdBy: IUser;
  createdAt: Date;
}

export interface IThreadDto {
  title: string;
  content: string;
  attachment: string;
  createdBy: string;
}
