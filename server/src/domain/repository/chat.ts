import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { IChat, IChatDto } from "../interfaces/IChat";
import { AppError } from "@/libs/app-error";
import { ChatTable } from "@/database/schema";
import * as schema from "@/database/schema";
import { asc, eq } from "drizzle-orm";

@Service()
class ChatRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new chat message in the database.
     * 
     * @param dto 
     * @returns {Promise<IChat>}
     */
    public create(dto: IChatDto): Promise<IChat> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(ChatTable)
                    .values({...dto})
                    .$returningId();

                const chatId = result[0].id;

                const chat = await this.db.query.ChatTable.findFirst({
                    where: eq(ChatTable.id, chatId),
                    with: {
                        createdBy: true
                    }
                });

                if (!chat) return reject(new AppError("Failed to create chat message", 400));

                resolve(chat as unknown as IChat);
            } catch (error: any) {
                reject(new AppError(error.message, 500));
            }
        });
    }

    /**
     * Retrieves all chat messages for a specific room.
     * 
     * @param roomId 
     * @returns {Promise<IChat[]>}
     */
    public getAll(roomId: string): Promise<IChat[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const chats = await this.db.query.ChatTable.findMany({
                    where: eq(ChatTable.roomId, roomId),
                    orderBy: asc(ChatTable.createdAt)
                });

                if (!chats.length) return reject(new AppError("No chat messages found", 404));

                resolve(chats as unknown as IChat[]);
            } catch (error: any) {
                reject(new AppError(error.message, 500));
            }
        });
    }
}

export default ChatRepository;
