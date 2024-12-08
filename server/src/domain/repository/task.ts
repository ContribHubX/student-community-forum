import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { TaskTable, TaskAssigneeTable } from "@/database/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";
import { AppError } from "@/libs/app-error";
import { ITask, ITaskDto, ITaskUpdateDto } from "../interfaces/ITask";

@Service()
class TaskRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new task and assigns users if provided.
     * 
     * @param {ITaskDto} dto
     * @returns {Promise<ITask>}
     */
    public async create(dto: ITaskDto): Promise<ITask> {
        const { name, description, attachment, status, createdBy, boardId, assignees } = dto;
        
        let taskId: string;

        return new Promise(async (resolve, reject) => {
            try {
                await this.db.transaction(async (trx) => {
                    const sequenceResult = await trx
                        .select({
                            lastSeq: sql<number>`MAX(${TaskTable.sequence})`.as("last_seq"),
                        })
                        .from(TaskTable)
                        .where(eq(TaskTable.status, status));
    
                    const lastSeq = sequenceResult[0]?.lastSeq || 0;
    
                    // Insert the task
                    const [insertedTask] = await trx
                        .insert(TaskTable)
                        .values({
                            name,
                            description,
                            attachment,
                            status,
                            sequence: lastSeq + 1,
                            createdBy,
                            boardId,
                        })
                        .$returningId();

                    if (!insertedTask?.id) {
                        throw new AppError("Task creation failed", 500);
                    }

                    taskId = insertedTask.id;
    
                    if (assignees?.length) {
                        await Promise.all(
                            assignees.map((user) =>
                                trx.insert(TaskAssigneeTable).values({
                                    assigneeId: String(user.id),
                                    taskId: insertedTask.id,
                                })
                            )
                        );
                    }
    
                });

                const fullTask = await this.getById(taskId);
                resolve(fullTask);
            } catch (error: any) {
                reject(new AppError(error.message || "Task creation failed", 500));
            }
        });
    }
    
    
    /**
     * Retrieves a task by its ID.
     * 
     * @param {string} taskId
     * @returns {Promise<ITask>}
     */
    public getById(taskId: string): Promise<ITask> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.TaskTable.findFirst({
                    where: eq(TaskTable.id, taskId),
                    with: {
                        createdBy: true,
                        assignees: {
                            columns: {},
                            with: {
                                assignee: true
                            }
                        },
                    },
                });

                //console.log(result)

                if (!result) {
                    return reject(new AppError("Task not found", 404));
                }

                const transformResult = {...result, assignees: result.assignees.map(assignee => ({
                    ...assignee?.assignee
                }))}

                // console.log(transformResult)

                resolve(transformResult as unknown as ITask);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves all tasks for a specific board.
     * 
     * @param {string} boardId
     * @returns {Promise<ITask[]>}
     */
    public getAll(boardId: string): Promise<ITask[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.TaskTable.findMany({
                    where: eq(TaskTable.boardId, boardId),
                    with: {
                        createdBy: true,
                        assignees: {
                            columns: {},
                            with: {
                                assignee: true
                            }
                        }
                    },
                    orderBy: (TaskTable, { asc }) => [asc(TaskTable.sequence)]
                });

                const transformResult = result.map(task => ({
                    ...task,
                    assignees: task.assignees.map(assignee => ({
                        ...assignee?.assignee
                    }))
                }))

                resolve(transformResult as unknown as ITask[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Updates an existing task and its assignees.
     * 
     * @param {ITaskUpdateDto} dto
     * @returns {Promise<ITask>}
     */
    public update(dto: ITaskUpdateDto): Promise<ITask> {
        const { taskId, name, description, attachment, status, sequence, assignees, isDragUpdate = false } = dto;
        
        // kayasa nigana ang giatay
        return new Promise(async (resolve, reject) => {
            try {
                await this.db.transaction(async (tx) => {
                    const result = await tx
                        .update(TaskTable)
                        .set({
                            name,
                            description,
                            attachment,
                            status,
                            sequence,
                        })
                        .where(eq(TaskTable.id, taskId));
    
                    if (!result) {
                        return reject(new AppError("Task update failed", 400));
                    }
    
                    // Update the sequence of tasks that have a greater sequence than the updated task
                    if (isDragUpdate) {
                        await tx
                            .update(TaskTable)
                            .set({
                                sequence: sql`${TaskTable.sequence} + 1` ,
                            })
                            .where(
                                and(
                                    gte(TaskTable.sequence, sequence),
                                    eq(TaskTable.status, status),     
                                    ne(TaskTable.id, taskId)         
                                )
                            );
                    }
    
                    // Update assignees kung naa
                    if (assignees?.length) {
                        // Clear existing assignees for the task
                        await tx.delete(TaskAssigneeTable).where(eq(TaskAssigneeTable.taskId, taskId));
    
                        // Insert new assignees
                        await Promise.all(
                            assignees.map((user) =>
                                tx.insert(TaskAssigneeTable).values({
                                    assigneeId: user.id,
                                    taskId,
                                })
                            )
                        );
                    }
                });

                const updatedTask = await this.getById(taskId);
                resolve(updatedTask);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Deletes a task by its ID, along with its associated assignees.
     * 
     * @param {string} taskId
     * @returns {Promise<ITask>}
     */
    public async delete(taskId: string): Promise<ITask | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const task = await this.getById(taskId);

                if (!task) return reject(new AppError("Task not found", 404));

                await this.db 
                    .delete(TaskTable)
                    .where(eq(TaskTable.id, taskId));

                resolve(task);
            } catch (error: any) {
                reject(new AppError(error.message || "Task deletion failed", 500));
            }
        });
    }

    
}

export default TaskRepository;
