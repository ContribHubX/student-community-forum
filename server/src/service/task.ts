import { ITask, ITaskDto, ITaskUpdateDto } from "@/domain/interfaces/ITask";
import TaskRepository from "@/domain/repository/task";
import { AppError } from "@/libs/app-error";
import EventManager from "@/sockets/event-manager";
import { Service, Inject } from "typedi";

@Service()
class TaskService {
    @Inject(() => TaskRepository)
    private taskRepo!: TaskRepository;

    @Inject(() => EventManager)
    private eventManager!: EventManager;

    /**
     * Creates a new task.
     * 
     * @param dto
     * @returns {Promise<ITask | undefined>}
     */
    public async createTask(dto: ITaskDto): Promise<ITask | undefined> {
        try {
            const result = await this.taskRepo.create(dto);
            this.eventManager.publishToMany<ITask>("task--new", result);

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Gets task details by ID.
     * 
     * @param taskId
     * @returns {Promise<ITask | undefined>}
     */
    public async getTaskById(taskId: string): Promise<ITask | undefined> {
        try {
            return this.taskRepo.getById(taskId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Gets all tasks for a specific board.
     * 
     * @param boardId
     * @returns {Promise<ITask[]>}
     */
    public async getAllTasks(boardId: string): Promise<ITask[]> {
        try {
            return this.taskRepo.getAll(boardId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }

    /**
     * Updates an existing task.
     * 
     * @param dto
     * @returns {Promise<ITask | undefined>}
     */
    public async updateTask(dto: ITaskUpdateDto): Promise<ITask | undefined> {
        try {
            const result = await this.taskRepo.update(dto);
            this.eventManager.publishToMany<ITask>("task--updated", result);
            

            return result;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }
}

export default TaskService;
