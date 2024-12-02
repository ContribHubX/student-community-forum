import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { ITodo, ITodoDto, ITodoUpdateDto } from "../interfaces/ITodo";
import { AppError } from "@/libs/app-error";
import * as schema from "@/database/schema";
import { TodoTable } from "@/database/schema";
import { eq } from "drizzle-orm";

@Service()
class TodoRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new TODO in the database.
     * 
     * @param dto 
     * @returns {Promise<ITodo>}
     */
    public create(dto: ITodoDto): Promise<ITodo> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(TodoTable)
                    .values({ ...dto, isDone: false })
                    .$returningId();

                const todoId = result[0].id;

                const todo = await this.db.query.TodoTable.findFirst({
                    where: eq(TodoTable.id, todoId),
                });

                if (!todo) return reject(new AppError("Failed to create TODO", 400));

                resolve(todo as unknown as ITodo);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Updates an existing TODO in the database.
     * 
     * @param todoId
     * @param updates 
     * @returns
     */
    public update(dto: ITodoUpdateDto): Promise<ITodo> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .update(TodoTable)
                    .set({...dto})
                    .where(eq(TodoTable.id, dto.todoId))

                if (!result || !result[0]) return reject(new AppError("Failed to update TODO", 400));

                const todo = await this.db.query.TodoTable.findFirst({
                    where: eq(TodoTable.id, dto.todoId),
                });

                if (!todo) return reject(new AppError("TODO not found", 404));

                resolve(todo as unknown as ITodo);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Deletes a TODO from the database.
     * 
     * @param todoId 
     * @returns {Promise<void>}
     */
    public delete(todoId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .delete(TodoTable)
                    .where(eq(TodoTable.id, todoId));

                // if (result.affectedRows === 0) return reject(new AppError("TODO not found", 404));

                resolve();
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves all TODOs for a given user ID.
     * 
     * @param userId 
     * @returns {Promise<ITodo[]>}
     */
    public getTodos(userId: string): Promise<ITodo[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const todos = await this.db.query.TodoTable.findMany({
                    where: eq(TodoTable.createdBy, userId),
                });

                if (!todos || todos.length === 0) return reject(new AppError("No TODOs found for the user", 404));

                resolve(todos as unknown as ITodo[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default TodoRepository;
