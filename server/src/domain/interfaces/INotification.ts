import { NotificationType, NotificationEntityType } from "@/types"
import { IUser } from "./IUser"

export interface INotification {
    id: string;
    message: string, 
    createdAt: Date,
    entityId: string,
    entityType: NotificationEntityType;
    type: NotificationType,
    link: string,
    isRead: boolean,
    createdBy: IUser | string,
    receiveBy: string
}

export interface INotificationDto {
    message: string, 
    entityId: string,
    entityType: NotificationEntityType;
    type: NotificationType,
    link: string,
    createdBy: string,
    receiveBy: string
}


export interface IRawNotificationDto {
    entityId: string,
    entityType: NotificationEntityType;
    type: NotificationType,
    createdBy: string,
    receiveBy: string
}