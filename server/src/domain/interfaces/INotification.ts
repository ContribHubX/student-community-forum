import { NotificationType } from "@/types"
import { IUser } from "./IUser"

export interface INotification {
    id: string,
    message: string, 
    createdAt: Date,
    entityId: string,
    entityType: "task" | "thread",
    type: NotificationType,
    link: string,
    isRead: boolean,
    createdBy: IUser | string,
    receiveBy: string
}

export interface INotificationDto {
    message: string, 
    entityId: string,
    entityType: "task" | "thread",
    type: NotificationType,
    link: string,
    createdBy: string,
    receiveBy: string
}


export interface IRawNotificationDto {
    entityId: string,
    entityType: "task" | "thread",
    type: NotificationType,
    createdBy: string,
    receiveBy: string
}