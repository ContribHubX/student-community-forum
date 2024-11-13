import { MySql2Database } from "drizzle-orm/mysql2";
import { Service, Container } from "typedi";
import * as schema from "@/database/schema";
import { IThreadReaction, IThreadReactionDto } from "../interfaces/IThread";
import { AppError } from "@/libs/app-error";
import { eq } from "drizzle-orm";

@Service()
class ThreadInteractionRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
      this.db = Container.get("database");
    } 

    /**
     * Creates thread reaction
     * @param dto 
     */
    public async react(dto: IThreadReactionDto): Promise<IThreadReaction | undefined> {
        try {
            const result = await this.db
                .insert(schema.ThreadReaction)
                .values({...dto})
                .$returningId();

            const reactionId = result[0].id;
            
            if (!reactionId) throw new AppError("Thread reaction not created", 500);
            
            const createdReaction = await this.db
                .query
                .ThreadReaction
                .findFirst({
                    where: eq(schema.ThreadReaction.id, reactionId)
                });

            return createdReaction as IThreadReaction;
        } catch (error: any) {
            throw new AppError(error.messsage, 500);
        }
    }
}

export default ThreadInteractionRepository;