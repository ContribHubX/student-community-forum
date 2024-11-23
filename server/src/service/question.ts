import { Service, Inject } from "typedi";
import QuestionRepository from "@/domain/repository/question";
import { AppError } from "@/libs/app-error";
import { IQuestion, IQuestionDto, IQuestionRequestDto, IQuestionRequest, IQuestionCreation } from "@/domain/interfaces/IQuestion";
import { IThread } from "@/domain/interfaces/IThread";
import { IUser } from "@/domain/interfaces/IUser";
import EventManager from "@/sockets/event-manager";
import NotificationService from "./notification";
import { NotificationType, QuestionRequestNotificationType } from "@/types";

@Service()
class QuestionService {
    @Inject(() => QuestionRepository)
    private questionRepo!: QuestionRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    @Inject(() => NotificationService)
    private notifService!: NotificationService;

    /**
     * Creates a new question.
     * 
     * @param dto - Data transfer object for creating a question.
     * @returns {Promise<IQuestion | undefined>} The created question.
     */
    public async createQuestion(dto: IQuestionDto): Promise<IQuestion | undefined> {
        try {
            return await this.questionRepo.create(dto);
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
}

export default QuestionService;
