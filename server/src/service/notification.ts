import { IRawNotificationDto, INotificationDto, INotification } from "@/domain/interfaces/INotification";
import NotificationRepository from "@/domain/repository/notification";
import { AppError } from "@/libs/app-error";
import EventManager from "@/sockets/event-manager";
import { QuestionRequestNotificationType, TaskNotificationType, ThreadNotificationType } from "@/types";
import { Inject, Service } from "typedi";

// TODO must implement (UserService, UserRepo)  

@Service()
class NotificationService {
    @Inject(() => NotificationRepository)
    private notificationRepo!: NotificationRepository;
    
    @Inject(() => EventManager)
    private eventManager!: EventManager;

    /**
     * Create notication
     * 
     * @param dto 
     * @returns {Promise<void>}
     */
    public async createNotification(dto: IRawNotificationDto): Promise<INotification | undefined> {
        let message;
        let link;

        if (dto.entityType === "task")
            message = this.getTaskNotificationMessage(dto.type);
            link = `api/task/${dto.entityId}`

        if (dto.entityType === "thread")
            message = this.getThreadNotificationMessage(dto.type);
            link = `api/thread/${dto.entityId}`

        if (dto.entityType === "question")
            message = this.getQuestionNotificationMessage(dto.type);
            link = `api/question/${dto.entityId}`
        
        // TODO must implement user service 
        message = "User " + message;
    
        const fDto: INotificationDto = {...dto, message, link};

        try {
            const notif = await this.notificationRepo.create(fDto);
            
            if (!notif) 
                throw new AppError("Create notification error"); 

            this.eventManager.publishToOne<INotification>("notification--new", notif, notif.receiveBy);
            
            return notif;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error); 
        }
    }

    /**
     * Fetche user notications
     * 
     * @param userId 
     * @returns {Promise<INotification[] | undefined>}
     */
    public async getNotifications(userId: string): Promise<INotification[] | undefined> {
        try {
            return await this.notificationRepo.getAll(userId);
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError("Error fetching notifications"); 
        }
    }

    /**
     * Utility function
     */
    private getThreadNotificationMessage(actionType: ThreadNotificationType): string {
        switch (actionType) {
            case 'like':
                return 'liked your thread.';
            case 'dislike':
                return 'disliked your thread.';
            case 'comment':
                return 'commented on your thread.';
            case 'reply':
                return 'replied to your comment on the thread.';
            default:
                return '';
        }
    }

    /**
     * Utility function
     */
    private getTaskNotificationMessage(actionType: TaskNotificationType): string {
        switch (actionType) {
            case 'assigned':
                return 'assigned you a new task.';
            case 'updated':
                return 'updated a task you are working on.';
            case 'completed':
                return 'completed a task you were working on.';
            default:
                return '';
        }
    }

    /**
     * Utility function
     */
    private getQuestionNotificationMessage(actionType: QuestionRequestNotificationType): string {
        return "requested you to answer a question"
    }
}

export default NotificationService;