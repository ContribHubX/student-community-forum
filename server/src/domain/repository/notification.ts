import { MySql2Database } from "drizzle-orm/mysql2";
import { Service, Container} from "typedi";
import * as schema from "@/database/schema";
import { AppError } from "@/libs/app-error";
import { INotificationDto } from "../interfaces/INotification";
import { NotificationTable } from "@/database/schema/notification";

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
     * @returns {Promise<void>}
     */
    public async create(dto: INotificationDto): Promise<void> {
        try {
            await this.db
                .insert(NotificationTable)
                .values({...dto})
        } catch (error: any) {
            throw new AppError(error.messsage, 500);
        }
    }
}

export default NotificationRepository;