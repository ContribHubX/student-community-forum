import { IRawNotificationDto, INotificationDto, INotification } from "@/domain/interfaces/INotification";
import NotificationRepository from "@/domain/repository/notification";
import { AppError } from "@/libs/app-error";
import { TaskNotificationType, ThreadNotificationType } from "@/types";
import { Inject, Service } from "typedi";

// TODO must implement (UserService, UserRepo)  

@Service()
class NotificationService {
    @Inject(() => NotificationRepository)
    private notificationRepo!: NotificationRepository;
    
    /**
     * Create notication
     * 
     * @param dto 
     * @returns {Promise<void>}
     */
    public async createNotification(dto: IRawNotificationDto): Promise<void> {
        let message;
        let link;

        if (dto.entityType === "task")
            message = this.getTaskNotificationMessage(dto.type);
            link = `api/task/${dto.entityId}`

        if (dto.entityType === "thread")
            message = this.getThreadNotificationMessage(dto.type);
            link = `api/thread/${dto.entityId}`
        
        // TODO must implement user service 
        message = "User " + message;
    
        const fDto: INotificationDto = {...dto, message, link};

        try {
            return await this.notificationRepo.create(fDto);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Create notification error"); 
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
}

export default NotificationService;