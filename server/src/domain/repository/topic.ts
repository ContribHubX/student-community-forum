import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { TopicTable, TopicFollowersTable } from "@/database/schema/topic";
import { ITopic, ITopicDto, ITopicFollowersDto } from "../interfaces/ITopic";
import { AppError } from "@/libs/app-error";
import { eq } from "drizzle-orm";

@Service()
class TopicRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new topic.
     * 
     * @param dto - Data transfer object containing topic details.
     * @returns A Promise that resolves with the created topic.
     * @throws AppError if creation fails.
     */
    public create(dto: ITopicDto): Promise<ITopic | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(TopicTable)
                    .values({ ...dto })
                    .$returningId();

                const topicId = result[0].id;

                if (!topicId) throw new AppError("Error creating topic", 500);

                const topic = await this.getTopicById(topicId);
                resolve(topic);
            } catch (error: any) {
                reject(new AppError(error, 500));
            }
        });
    }

    /**
     * Retrieves all topics.
     * 
     * @returns A Promise that resolves with a list of all topics.
     * @throws AppError if fetching fails.
     */
    public getAll(): Promise<ITopic[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const topics = await this.db.query.TopicTable.findMany({
                    with: { createdBy: true },
                });
                resolve(topics as unknown as ITopic[]);
            } catch (error: any) {
                reject(new AppError(error, 500));
            }
        });
    }

    /**
     * Retrieves a topic by its ID.
     * 
     * @param topicId - The ID of the topic to retrieve.
     * @returns A Promise that resolves with the topic or undefined if not found.
     * @throws AppError if fetching fails.
     */
    public getTopicById(topicId: string): Promise<ITopic | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const topic = await this.db.query.TopicTable.findFirst({
                    where: eq(TopicTable.id, topicId),
                    with: { createdBy: true },
                });
                resolve(topic as unknown as ITopic);
            } catch (error: any) {
                reject(new AppError(error, 500));
            }
        });
    }

    /**
     * Follows a topic.
     * 
     * @param dto - Data transfer object containing follower details.
     * @returns A Promise that resolves when the operation completes.
     * @throws AppError if the operation fails.
     */
    public follow(dto: ITopicFollowersDto): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.db.insert(TopicFollowersTable).values({ ...dto });
                resolve();
            } catch (error: any) {
                reject(new AppError(error, 500));
            }
        });
    }
}

export default TopicRepository;
