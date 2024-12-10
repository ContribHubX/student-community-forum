import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import { ICommunity, ICommunityDto, IJoinCommunityDto } from "../interfaces/ICommunity";
import { AppError } from "@/libs/app-error";
import * as schema from "@/database/schema";
import { CommunityTable, UsersCommunities } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { IUser } from "../interfaces/IUser";

@Service()
class CommunityRepository {
    private db: MySql2Database<typeof schema>;

    constructor() {
        this.db = Container.get("database");
    }

    /**
     * Adds a new community to the database.ack
     *
     * @param dto Community data.
     * @returns The created community or undefined.
     */
    public create(dto: ICommunityDto): Promise<ICommunity | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db
                    .insert(CommunityTable)
                    .values({ ...dto })
                    .$returningId();

                const communityId = result[0].id;

                // join user who created 
                await this.join({
                    userId: dto.createdBy,
                    communityId
                })

                const community = await this.getById(communityId);
                resolve(community);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Joins a user to a community.
     *
     * @param dto Join community data.
     */
      public join(dto: IJoinCommunityDto): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                // check first if user already joins the community
                const isJoin = await this.db
                    .query
                    .UsersCommunities
                    .findFirst({
                        where: and(
                            eq(UsersCommunities.communityId, dto.communityId),
                            eq(UsersCommunities.userId, dto.userId)
                        )
                    });

                if (isJoin) return reject(new AppError("User already joined", 400)); 

                await this.db.insert(UsersCommunities).values({ ...dto }).$returningId();
                resolve(dto.communityId as unknown as string);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Fetches community details by ID.
     *
     * @param communityId Community ID.
     * @returns The community or undefined.
     */
    public getById(communityId: string): Promise<ICommunity | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.CommunityTable.findFirst({
                    where: eq(CommunityTable.id, communityId),
                    with: {
                        createdBy: true,
                        members: {
                            with: {
                                user: true,
                            },
                        },
                    },
                });

                if (!result) {
                    return reject(new AppError("Community not found", 404));
                }

                resolve(result as unknown as ICommunity);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    /**
     * Get all communities
     *
     * @param
     * @returns {Promise<ICommunity[]>}
     */
    public getAll(): Promise<ICommunity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.CommunityTable.findMany({
                    with: {
                        createdBy: true,
                        members: {
                            with: {
                                user: true,
                            },
                        },
                    },
                });

                resolve(result as unknown as ICommunity[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    public getUserCommunities(userId: string): Promise<ICommunity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.UsersCommunities.findMany({
                   columns: {},
                   where: eq(UsersCommunities.userId, userId),
                   with: {
                        community: true
                   }
                });

                if (!result) {
                    return reject(new AppError("Community not found", 404));
                }

                // const userCreatedComms = await this.db.query.CommunityTable.findMany({
                //     where: eq(CommunityTable.createdBy, userId),
                //     with: {
                //         createdBy: true
                //     }
                // })

                resolve(result.map(res => res.community) as unknown as ICommunity[]);
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }

    public getMembers(communityId: string): Promise<IUser[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.db.query.UsersCommunities.findMany({
                    columns: {},
                    with: {
                        user: true,
                    },
                    where: eq(UsersCommunities.communityId, communityId)
                });

                resolve(result.map(res => res.user));
            } catch (error: any) {
                reject(new AppError(error));
            }
        });
    }
}

export default CommunityRepository;
