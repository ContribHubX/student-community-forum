import { Service, Inject } from "typedi";
import { IChat, IChatDto } from "@/domain/interfaces/IChat";
import { ITodo, ITodoDto, ITodoUpdateDto } from "@/domain/interfaces/ITodo";
import ChatRepository from "@/domain/repository/chat";
import TodoRepository from "@/domain/repository/todo";
import { AppError } from "@/libs/app-error";
import EventManager from "@/pubsub/event-manager";
import StudyRoomRepository from "@/domain/repository/study-room";
import { IStudyRoom, IStudyRoomDto } from "@/domain/interfaces/IStudyRoom";

@Service()
class StudyRoomService {
    @Inject(() => ChatRepository)
    private chatRepo!: ChatRepository;

    @Inject(() => TodoRepository)
    private todoRepo!: TodoRepository;

    @Inject(() => StudyRoomRepository)
    private roomRepo!: StudyRoomRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    
    /**
     * Create a new study room.
     *
     * @param dto
     * @returns {Promise<IStudyRoom | undefined>}
     */
    public async createRoom(dto: IStudyRoomDto): Promise<IStudyRoom | undefined> {
        try {
            const result = await this.roomRepo.create(dto);
            //this.eventManager.publishToMany<IStudyRoom>("chat--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Retrieves all study rooms
     *
     * @param dto
     * @returns {Promise<IStudyRoom[] | undefined>}
     */
    public async getAllRoom(): Promise<IStudyRoom[] | undefined> {
        try {
            const result = await this.roomRepo.getAll();
            //this.eventManager.publishToMany<IStudyRoom>("chat--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Retrieves a specific study room
     *
     * @param dto
     * @returns {Promise<IStudyRoom | undefined>}
     */
    public async getRoomById(roomId: string): Promise<IStudyRoom | undefined> {
        try {
            const result = await this.roomRepo.getById(roomId);
            //this.eventManager.publishToMany<IStudyRoom>("chat--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Create a new chat message in a study room.
     *
     * @param dto
     * @returns {Promise<IChat | undefined>}
     */
    public async createChat(dto: IChatDto): Promise<IChat | undefined> {
        try {
            const result = await this.chatRepo.create(dto);
            this.eventManager.publishToMany<IChat>("room-chat--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Get all chat messages for a specific study room.
     *
     * @param roomId
     * @returns {Promise<IChat[]>}
     */
    public async getAllChats(roomId: string): Promise<IChat[]> {
        try {
            return this.chatRepo.getAll(roomId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Create a new task in a study room.
     *
     * @param dto
     * @returns {Promise<ITodo | undefined>}
     */
    public async createTodo(dto: ITodoDto): Promise<ITodo | undefined> {
        try {
            const result = await this.todoRepo.create(dto);
            //this.eventManager.publishToMany<ITodo>("task--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Update an existing task in a study room.
     *
     * @param dto
     * @returns {Promise<ITodo | undefined>}
     */
    public async updateTodo (dto: ITodoUpdateDto): Promise<ITodo | undefined> {
        try {
            const result = await this.todoRepo.update(dto);
            //this.eventManager.publishToMany<ITodo>("task--updated", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }

    /**
     * Get all tasks for a specific board in a study room.
     *
     * @param userId
     * @returns {Promise<ITodo[]>}
     */
    public async getAllTodos(userId: string): Promise<ITodo[]> {
        try {
            return this.todoRepo.getTodos(userId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message);
        }
    }
}

export default StudyRoomService;
