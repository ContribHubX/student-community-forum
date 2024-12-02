import TopicRepository from "@/domain/repository/topic";
import { AppError } from "@/libs/app-error";
import { ITopic, ITopicDto, ITopicFollowersDto, ITopicUserFollow } from "@/domain/interfaces/ITopic";
import { Inject, Service } from "typedi";
import { IUser } from "@/domain/interfaces/IUser";
import EventManager from "@/pubsub/event-manager";

@Service()
class TopicService {
    @Inject(() => TopicRepository)
    private topicRepo!: TopicRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    /**
     * Creates a new topic.
     * 
     * @param dto - Data transfer object for topic creation.
     * @returns The created topic.
     */
    public async createTopic(dto: ITopicDto): Promise<ITopic | undefined> {
        try {
            return await this.topicRepo.create(dto);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Retrieves all topics.
     * 
     * @returns A list of all topics.
     */
    public async getAllTopics(): Promise<ITopic[]> {
        try {
            return await this.topicRepo.getAll();
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Retrieves a topic by its ID.
     * 
     * @param topicId - The ID of the topic to retrieve.
     * @returns The topic or undefined if not found.
     */
    public async getTopicById(topicId: string): Promise<ITopic | undefined> {
        try {
            return await this.topicRepo.getTopicById(topicId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Follows a topic.
     * 
     * @param dto - Data transfer object for following a topic.
     * @returns {Promise<IUser>}
     */
    public async followTopic(dto: ITopicFollowersDto): Promise<ITopicUserFollow> {
        try {
            const result = await this.topicRepo.follow(dto);
            this.eventManager.publishToMany<ITopicUserFollow>("topic-follow--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Retrieves followers in a topic.
     * 
     * @param topicId - The ID of the topic to retrieve.
     * @returns The topic or undefined if not found.
     */
    public async getTopicFollowers(topicId: string): Promise<IUser[]> {
        try {
            return await this.topicRepo.getFollowers(topicId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }
}

export default TopicService;
