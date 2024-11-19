import { MySql2Database } from "drizzle-orm/mysql2";
import { Service, Container } from "typedi";
import * as schema from "@/database/schema";
import { AppError } from "@/libs/app-error";
import { INotification, INotificationDto } from "../interfaces/INotification";
import { NotificationTable } from "@/database/schema/notification";
import { eq } from "drizzle-orm";

@Service()
class NotificationRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Inserts notification into db
     * 
     * @param dto 
     * @returns {Promise<INotification | undefined>}
     */
    public create(dto: INotificationDto): Promise<INotification | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(NotificationTable)
                    .values({ ...dto })
                    .$returningId();

                const notifId = result[0].id;

                // Return back created notification
                const notification = await this.getNotifById(notifId);
                resolve(notification);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Get's user notifications
     * 
     * @param userId 
     * @returns {Promise<INotification[] | undefined>}
     */
    public getAll(userId: string): Promise<INotification[] | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.NotificationTable.findMany({
                    where: eq(NotificationTable.receiveBy, userId),
                    with: { createdBy: true },
                });

                resolve(result as unknown as INotification[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Get's notification details
     * 
     * @param notifId 
     * @returns {Promise<INotification | undefined>}
     */
    public getNotifById(notifId: string): Promise<INotification | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.NotificationTable.findFirst({
                    where: eq(NotificationTable.id, notifId),
                    with: { createdBy: true },
                });

                resolve(result as unknown as INotification);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default NotificationRepository;
