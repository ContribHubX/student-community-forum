import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { ICommunity, ICommunityDto, IJoinCommunityDto } from "../interfaces/ICommunity";
import { AppError } from "@/libs/app-error";
import * as schema from "@/database/schema";
import { CommunityTable, UsersCommunities } from "@/database/schema";
import { eq } from "drizzle-orm";

@Service()
class CommunityRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }
    
    /**
     * Adds a new community to the database.
     * 
     * @param dto Community data.
     * @returns The created community or undefined.
     */
    public async create(dto: ICommunityDto): Promise<ICommunity | undefined> {
        try {
            const result = await this.db 
                .insert(CommunityTable)
                .values({...dto})
                .$returningId();

            const communityId = result[0].id;

            return this.getById(communityId);
        } catch (error: any) {
            throw new AppError(error, 500);
        }
    }

    /**
     * Fetches community details by ID.
     * 
     * @param communityId Community ID.
     * @returns The community or undefined.
     */
    public async getById(communityId: string): Promise<ICommunity | undefined> {
        try {
            const result = await this.db 
                .query
                .CommunityTable
                .findFirst({
                    where: eq(CommunityTable.id, communityId),
                    with: {
                        createdBy: true,
                        members: {
                            with: {
                                user: true
                            }
                        }
                    }
                });
            
            if (!result) {
                throw new AppError("Community not found", 404);
            }

            return result as unknown as ICommunity;
        } catch (error: any) {
            throw new AppError(error, 500);
        }
    }

    /**
     * Joins a user to a community.
     * 
     * @param dto Join community data.
     */
    public async join(dto: IJoinCommunityDto): Promise<void> {
        try {
            await this.db 
                .insert(UsersCommunities)
                .values({...dto});
        } catch(error: any) {
            throw new AppError(error, 500);
        }
    }
}

export default CommunityRepository;
