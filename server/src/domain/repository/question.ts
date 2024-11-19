import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { IQuestion, IQuestionDto, IQuestionRequest, IQuestionRequestDto } from "../interfaces/IQuestion";
import { AppError } from "@/libs/app-error";
import { eq } from "drizzle-orm";

@Service()
class QuestionRepository {
    private db: MySql2Database<typeof schema>;
    
    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new question in the database.
     * @param dto - The data transfer object containing question details.
     * @returns A promise that resolves to the created question.
     */
    public create(dto: IQuestionDto): Promise<IQuestion | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(schema.QuestionTable)
                    .values({ ...dto })
                    .$returningId();

                const questionId = result[0].id;

                resolve(this.getById(questionId));
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves a question by its ID.
     * 
     * @param questionId - The ID of the question to retrieve.
     * @returns A promise that resolves to the question or undefined if not found.
     */
    public getById(questionId: string): Promise<IQuestion | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.QuestionTable.findFirst({
                    where: eq(schema.QuestionTable.id, questionId),
                    with: { createdBy: true },
                });

                if (!result) return reject(new AppError("Question not found", 404));

                resolve(result as unknown as IQuestion);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    
    /**
     * Retrieves all questions 
     * 
     * @param none
     * @returns {Promise<IQuestion>}
     */
    public getAll(): Promise<IQuestion[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.QuestionTable.findMany({});
                resolve(result as unknown as IQuestion[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Creates a request for a user to answer a question.
     * 
     * @param dto - The data transfer object containing request details.
     * @returns A promise that resolves when the request is created.
     */
    public request(dto: IQuestionRequestDto): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.db.insert(schema.QuestionRequestTable).values({ ...dto }).$returningId();

                resolve();
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves all questions requested to a specific user.
     * 
     * @param requestedToId - The ID of the user to whom the questions were requested.
     * @returns A promise that resolves to the list of question requests.
     */
    public getRequest(requestedToId: string): Promise<IQuestionRequest> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.QuestionRequestTable.findMany({
                    columns: {},
                    with: {
                        question: true,
                        requestedBy: true,
                        requestedTo: true,
                    },
                    where: eq(schema.QuestionRequestTable.requestedTo, requestedToId),
                });

                resolve(result as unknown as IQuestionRequest);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default QuestionRepository;
