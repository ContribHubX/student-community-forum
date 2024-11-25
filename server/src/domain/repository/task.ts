import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { TaskTable, TaskAssigneeTable } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
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
        const { name, description, attachment, status, createdBy, boardId, assingnees } = dto;

        return new Promise(async (resolve, reject) => {
            try {
                const sequence = await this.db
                    .select({
                        lastSeq: sql<number>`MAX(${TaskTable.sequence})`.as("last_seq")
                    })
                    .from(TaskTable)
                    .where(eq(TaskTable.status, status));
            

                const result = await this.db
                    .insert(TaskTable)
                    .values({
                        name, description,
                        attachment, status,
                        sequence: sequence[0].lastSeq + 1, createdBy,
                        boardId,
                    })
                    .$returningId();

                const insertedTask = result[0].id;

                if (assingnees?.length) {
                    assingnees.forEach(async (user) => {
                        await this.db
                            .insert(schema.TaskAssigneeTable)
                            .values({
                                assigneeId: user.id,
                                taskId: insertedTask,
                            });
                    });
                }

                resolve(await this.getById(insertedTask));
            } catch (error: any) {
                reject(new AppError(error));
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
                            with: {
                                assignee: true,
                            },
                        },
                    },
                });

                if (!result) {
                    return reject(new AppError("Task not found", 404));
                }

                resolve(result as unknown as ITask);
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
                            with: {
                                assignee: true,
                            },
                        },
                    },
                    orderBy: (TaskTable, { asc }) => [asc(TaskTable.sequence)]
                });

                resolve(result as unknown as ITask[]);
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
        const { taskId, name, description, attachment, status, sequence, assingnees } = dto;
        
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
                    await tx
                        .update(TaskTable)
                        .set({
                            sequence: sql`${TaskTable.sequence} + 1` ,
                        })
                        .where(
                                sql`${TaskTable.sequence} >= ${sequence} 
                                                         AND ${TaskTable.status} = ${status}
                                                         AND ${TaskTable.id} != ${taskId}`
                        );
    
                    // Update assignees kung naa
                    if (assingnees?.length) {
                        // Clear existing assignees for the task
                        await tx.delete(TaskAssigneeTable).where(eq(TaskAssigneeTable.taskId, taskId));
    
                        // Insert new assignees
                        await Promise.all(
                            assingnees.map((user) =>
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
    
}

export default TaskRepository;
