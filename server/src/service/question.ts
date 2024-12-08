import { Service, Inject } from "typedi";
import QuestionRepository from "@/domain/repository/question";
import { AppError } from "@/libs/app-error";
import { IQuestion, IQuestionDto, IQuestionRequestDto, IQuestionRequest, IQuestionCreation, IQuestionVote, IQuestionUpvoteDto, IQuestionVoteStats } from "@/domain/interfaces/IQuestion";
import { IThread } from "@/domain/interfaces/IThread";
import { IUser } from "@/domain/interfaces/IUser";
import EventManager from "@/pubsub/event-manager";
import NotificationService from "./notification";
import { NotificationType } from "@/types";
import TopicRepository from "@/domain/repository/topic";

@Service()
class QuestionService {
    @Inject(() => QuestionRepository)
    private questionRepo!: QuestionRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    @Inject(() => NotificationService)
    private notifService!: NotificationService;

    @Inject(() => TopicRepository)
    private topicRepo!: TopicRepository;

    /**
     * Creates a new question.
     * 
     * @param dto - Data transfer object for creating a question.
     * @returns {Promise<IQuestion | undefined>} The created question.
     */
    public async createQuestion(dto: IQuestionDto): Promise<IQuestion | undefined> {
        try {
            const question =  await this.questionRepo.create(dto);
            this.eventManager.publishToMany<IQuestion>("question--new", question);

            if (question?.topicId) {
                // get followers
                const followers = await this.topicRepo.getFollowers(question.topicId); 

                await Promise.all([
                    followers.map(async (follower) => {
                        await this.notifService.createNotification({
                            entityId: question.topicId || "",
                            entityType: "topic",
                            type: "new" as NotificationType,
                            createdBy: question.createdBy.id,
                            receiveBy: follower.id,
                        });
                    })
                ])
            }

            return question;

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Retrieves a question by its ID.
     * 
     * @param questionId - The ID of the question to retrieve.
     * @returns {Promise<IQuestion | undefined>} The question details.
     */
    public async getQuestionById(questionId: string): Promise<IQuestion | undefined> {
        try {
            return await this.questionRepo.getById(questionId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Retrieves all questions
     * 
     * @param topicId | null
     * @returns {Promise<IQuestion[]>} T
     */
    public async getAllQuestions(topicId?: string): Promise<IQuestion[]> {
        try {
            return await this.questionRepo.getAll(topicId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Creates a request for a user to answer a question.
     * 
     * @param dto - Data transfer object for creating a question request.
     * @returns {Promise<IQuestionRequest>}
     */
    public async createQuestionRequest(dto: IQuestionRequestDto): Promise<IQuestionRequest> {
        try {
            const result = await this.questionRepo.request(dto);
            this.eventManager.publishToOne<IQuestionRequest>("request--new", result, result.requestedTo.id);

            //notify user
            await this.notifService.createNotification({
                entityId: dto.questionId,
                entityType: "question",
                type: "request" as NotificationType,
                createdBy: dto.requestedBy,
                receiveBy: dto.requestedTo,
              });

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Retrieves all questions requested to a specific user.
     * 
     * @param requestedToId - The ID of the user to whom the questions were requested.
     * @returns {Promise<IQuestionRequest>} The list of question requests.
     */
    public async getQuestionsRequestedTo(requestedToId: string): Promise<IQuestionRequest> {
        try {
            return await this.questionRepo.getRequest(requestedToId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    public async getThreadsByQuestionId(questionId: string): Promise<IThread[]> {
        try {
            return await this.questionRepo.getThreadsByQuestionId(questionId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    public async getUsersByQuestion(questionId: string): Promise<IUser[]> {
        try {
            return await this.questionRepo.getUsersByQuestionId(questionId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    public async voteQuestion(dto: IQuestionUpvoteDto): Promise<IQuestionVote> {
        try {
            const result = await this.questionRepo.vote(dto);
            this.eventManager.publishToMany<IQuestionVote>("vote--new", result);
            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    public async getQuestionVotes(dto: Partial<IQuestionUpvoteDto>): Promise<IQuestionVoteStats> {
        try {
            return await this.questionRepo.getVotes(dto);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }
}

export default QuestionService;
