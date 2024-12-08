import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { TopicTable, TopicFollowersTable } from "@/database/schema/topic";
import { ITopic, ITopicDto, ITopicFollowersDto, ITopicGetByIdDto, ITopicUserFollow } from "../interfaces/ITopic";
import { AppError } from "@/libs/app-error";
import { eq, sql } from "drizzle-orm";
import { IUser } from "../interfaces/IUser";

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

                // insert owner in follower
                await this.follow({ followerId: dto.createdBy, topicId });

                const topic = await this.getTopicById({topicId, userId: dto.createdBy});
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

    // TODO get popular topicss
    public getPopular(): Promise<ITopic[]>  {
        return new Promise(async (resolve, reject) => {
            try {
                const topics = await this.db.query.TopicTable.findMany({
                    columns: {},
                    extras: {
                        followerCount: sql<number>`(
                            SELECT COUNT(topic_id) FROM topic_followers
                            WHERE ${TopicTable.id} = ${TopicFollowersTable.topicId}
                             
                        )`.as("follower_count")
                    }
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
    public getTopicById(dto: ITopicGetByIdDto): Promise<ITopic | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const topic = await this.db.query.TopicTable.findFirst({
                    where: eq(TopicTable.id, dto.topicId),
                    with: { createdBy: true },
                    extras: {
                        isFollowing: sql<boolean>`EXISTS (
                            SELECT 1
                            FROM ${schema.TopicFollowersTable} 
                            WHERE topic_id = ${dto.topicId} 
                            AND follower_id = ${dto.userId}
                        )`.as("is_following"),
                    }
                });
                resolve({
                    ...topic,
                    isFollowing: topic?.isFollowing || false,
                } as unknown as ITopic);
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
    public follow(dto: ITopicFollowersDto): Promise<ITopicUserFollow> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(TopicFollowersTable)
                    .values({ ...dto })
                    .$returningId()

                const resultId = result[0].id;

                const topicFollower = await this.db
                    .query
                    .TopicFollowersTable
                    .findFirst({
                        columns: { topicId: true },
                        where: eq(TopicFollowersTable.id, resultId),
                        with: {
                            user: true
                        }
                    })
                    
                resolve(topicFollower as ITopicUserFollow);
            } catch (error: any) {
                reject(new AppError(error, 500));
            }
        });
    }

    public getFollowers(topicId: string): Promise<IUser[]> {
        return new Promise(async (resolve, reject) => {
            try {
            
                const topicFollower = await this.db
                    .query
                    .TopicTable
                    .findFirst({
                        columns: {},
                        where: eq(TopicTable.id, topicId),
                        with: {
                            followers: {
                                columns: {},
                                with: {
                                    user: true
                                }
                            }
                        }
                    })

                if (!topicFollower) 
                    return resolve([])
                    
                resolve(topicFollower?.followers.map(follower => follower.user) as IUser[]);
            } catch (error: any) {
                reject(new AppError(error, 500));
            }
        });
    }
}

export default TopicRepository;
