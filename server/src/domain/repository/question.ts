import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { IQuestion, IQuestionDto, IQuestionRequest, IQuestionRequestDto, IQuestionUpvoteDto, IQuestionVote, IQuestionVoteStats } from "../interfaces/IQuestion";
import { AppError } from "@/libs/app-error";
import { and, desc, eq } from "drizzle-orm";
import { IThread } from "../interfaces/IThread";
import { IUser } from "../interfaces/IUser";
import { QuestionRequestTable, QuestionTable, QuestionVotesTable } from "@/database/schema";

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
                    .values({ ...dto, topicId: dto.topicId !== "" ? dto.topicId : null })
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
                    with: { 
                            createdBy: true,
                            threads: true
                    },
        
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
     * @param topicId | null
     * @returns {Promise<IQuestion>}
     */
    public getAll(topicId?: string): Promise<IQuestion[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let result;
            
                if (!topicId) {
                    result = await this.db.query.QuestionTable.findMany({
                        with: {
                            createdBy: true,
                            threads: true
                        },
                        orderBy: desc(QuestionTable.createdAt)
                    });
                } else 
                    result = await this.db.query.QuestionTable.findMany({
                        where: eq(schema.QuestionTable.topicId, topicId),
                        with: {
                            createdBy: true,
                            threads: true
                        },
                        orderBy: desc(QuestionTable.createdAt)
                    });

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
    public request(dto: IQuestionRequestDto): Promise<IQuestionRequest> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.insert(QuestionRequestTable).values({ ...dto }).$returningId();

                const requestId = result[0].id;

                const request = await this.db 
                    .query
                    .QuestionRequestTable
                    .findFirst({
                        columns: {},
                        where: eq(QuestionRequestTable.id, requestId),
                        with: { 
                            question: true,
                            requestedBy: true,
                            requestedTo: true
                        }
                    })

                resolve(request as unknown as IQuestionRequest);
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

    public getThreadsByQuestionId(questionId: string): Promise<IThread[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .query
                    .QuestionTable
                    .findFirst({
                        columns: {},
                        with: { 
                            threads: {
                                with: {
                                    createdBy: true
                                }
                            } 
                        },
                        where: eq(schema.QuestionTable.id, questionId)
                    });
                
                if (!result) return reject(new AppError("Question not found", 404));

                resolve(result.threads as unknown as IThread[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    public getUsersByQuestionId(questionId: string): Promise<IUser[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .query
                    .QuestionTable
                    .findFirst({
                        columns: {},
                        with: { 
                            threads: {
                                columns: {},
                                with: {
                                    createdBy: true
                                }
                            } 
                        },
                        where: eq(schema.QuestionTable.id, questionId)
                    });
                
                if (!result) return reject(new AppError("Question not found", 404));

                const users = Array.from(
                    new Map(
                        result.threads.map(res => [res.createdBy.id, res.createdBy])
                    ).values()
                );

                resolve(users as unknown as IUser[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Upvote a question
     * 
     */
    public vote(dto: IQuestionUpvoteDto): Promise<IQuestionVote> {
        return new Promise(async (resolve, reject) => {
            try {
                // check first if the user already upvoted
                const isAlreadyVoted = await this.db
                    .query
                    .QuestionVotesTable
                    .findFirst({
                        where: and(
                            eq(QuestionVotesTable.userId, dto.userId),
                            eq(QuestionVotesTable.questionId, dto.questionId)
                        )
                    })

                if (isAlreadyVoted) {
                    reject(new AppError('User has already voted this question', 400));
                    return;
                }

                const result = await this.db
                    .insert(QuestionVotesTable)
                    .values({...dto})
                    .$returningId();

                if (!result) {
                    reject(new AppError('Upvote failed', 400));
                    return;
                }
                
                resolve(dto)
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    
    /**
     * Upvote a question
     * 
     */
    public getVotes(dto: Partial<IQuestionUpvoteDto>): Promise<IQuestionVoteStats> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .query
                    .QuestionVotesTable
                    .findMany({
                        where: eq(QuestionVotesTable.questionId, dto.questionId!)
                    })

                if (!result) {
                    reject(new AppError("Failed to get votes", 400));
                }

                const upvoteCount = result.filter(res => res.vote === "up");
                const downvoteCount = result.filter(res => res.vote === "down");
                const userVote = result.find(res => res.userId === dto.userId)?.vote;

                resolve({
                    upvoteCount: upvoteCount.length,
                    downvoteCount: downvoteCount.length,
                    userVote: userVote || "none"
                })
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default QuestionRepository;
