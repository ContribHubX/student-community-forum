import TopicRepository from "@/domain/repository/topic";
import { AppError } from "@/libs/app-error";
import { ITopic, ITopicDto, ITopicFollowersDto } from "@/domain/interfaces/ITopic";
import { Inject, Service } from "typedi";

@Service()
class TopicService {
    @Inject(() => TopicRepository)
    private topicRepo!: TopicRepository;

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
     */
    public async followTopic(dto: ITopicFollowersDto): Promise<void> {
        try {
            await this.topicRepo.follow(dto);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }
}

export default TopicService;
