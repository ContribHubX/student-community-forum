import { MySql2Database } from "drizzle-orm/mysql2";
import { Service, Container} from "typedi";
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
     * @returns {Promise<INotification[] | undefined>}
     */
    public async create(dto: INotificationDto): Promise<INotification | undefined> {
        try {
            const result = await this.db
                .insert(NotificationTable)
                .values({...dto})
                .$returningId();

            const notifId = result[0].id;
            
            // return back created notif
            return this.getNotifById(notifId);
            
        } catch(error: any) {
            throw new AppError(error.messsage, 500);
        }
    }

    /**
     * Get's user notifications
     * 
     * @param dto 
     * @returns {Promise<INotification[] | undefined>}
     */
    public async getAll(userId: string): Promise<INotification[] | undefined> {
        try {
            const result = await this.db
                .query
                .NotificationTable
                .findMany({
                    where: eq(NotificationTable.receiveBy, userId),
                    with: { createdBy: true }
                })

            return (result as unknown as INotification[]);
        } catch(error: any) {
            throw new AppError(error.messsage, 500);
        }
    } 

    /**
     * Get's notification details
     * 
     * @param notifId 
     * @returns {Promise<INotification | undefined>}
     */
    public async getNotifById(notifId: string): Promise<INotification | undefined> {
        try {
            const result = await this.db
                .query
                .NotificationTable
                .findFirst({
                    where: eq(NotificationTable.id, notifId),
                    with: { createdBy: true }
                })

            return (result as unknown as INotification);
        } catch(error: any) {
            throw new AppError(error.messsage, 500);
        }
    }
}

export default NotificationRepository;