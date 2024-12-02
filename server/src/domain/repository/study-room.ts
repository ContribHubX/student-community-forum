import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import * as schema from "@/database/schema";
import { IStudyRoom, IStudyRoomDto } from "../interfaces/IStudyRoom";
import { AppError } from "@/libs/app-error";
import { desc, eq } from "drizzle-orm";

@Service()
class StudyRoomRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Creates a new study room in the database.
     * 
     * @param dto 
     * @returns {Promise<IStudyRoom | undefined>}
     */
    public create(dto: IStudyRoomDto): Promise<IStudyRoom | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(schema.StudyRoomTable)
                    .values(dto)
                    .$returningId();

                const studyRoomId = result[0].id;

                resolve(this.getById(studyRoomId));
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves a study room by its ID.
     * 
     * @param studyRoomId - The ID of the study room to retrieve.
     * @returns {Promise<IStudyRoom | undefined>}
     */
    public getById(studyRoomId: string): Promise<IStudyRoom | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.StudyRoomTable.findFirst({
                    where: eq(schema.StudyRoomTable.id, studyRoomId),
                    with: { createdBy: true },
                });

                if (!result) return reject(new AppError("Study room not found", 404));

                resolve(result as unknown as IStudyRoom);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves all study rooms.
     * 
     * @returns {Promise<IStudyRoom[]>}
     */
    public getAll(): Promise<IStudyRoom[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.StudyRoomTable.findMany({
                    with: { createdBy: true },
                    orderBy: desc(schema.StudyRoomTable.createdAt),
                });

                resolve(result as unknown as IStudyRoom[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Retrieves all study rooms created by a specific user.
     * 
     * @param createdBy 
     * @returns {Promise<IStudyRoom[]>}
     */
    public getByCreator(createdBy: string): Promise<IStudyRoom[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.StudyRoomTable.findMany({
                    where: eq(schema.StudyRoomTable.createdBy, createdBy),
                    with: { createdBy: true },
                });

                resolve(result as unknown as IStudyRoom[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Updates a study room's details.
     * 
     * @param id 
     * @param dto 
     * @returns {Promise<IStudyRoom | undefined>}
     */
    public update(id: string, dto: Partial<IStudyRoomDto>): Promise<IStudyRoom | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.update(schema.StudyRoomTable)
                    .set(dto)
                    .where(eq(schema.StudyRoomTable.id, id))

                if (!result.length) return reject(new AppError("Study room not found", 404));

                resolve(result[0] as unknown as IStudyRoom);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Deletes a study room by its ID.
     * 
     * @param id 
     * @returns {Promise<string>}
     */
    public delete(id: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.delete(schema.StudyRoomTable)
                    .where(eq(schema.StudyRoomTable.id, id));

                if (!result) return reject(new AppError("Study room not found", 404));

                resolve("Study room deleted successfully");
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default StudyRoomRepository;
