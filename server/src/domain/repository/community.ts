import { MySql2Database } from "drizzle-orm/mysql2";
import Container, { Service } from "typedi";
import {
  ICommunity,
  ICommunityDto,
  IJoinCommunityDto,
} from "../interfaces/ICommunity";
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
  public create(dto: ICommunityDto): Promise<ICommunity | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.db
          .insert(CommunityTable)
          .values({ ...dto })
          .$returningId();

        const communityId = result[0].id;
        const community = await this.getById(communityId);
        resolve(community);
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
   * Joins a user to a community.
   *
   * @param dto Join community data.
   */
  public join(dto: IJoinCommunityDto): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.insert(UsersCommunities).values({ ...dto });
        resolve();
      } catch (error: any) {
        reject(new AppError(error));
      }
    });
  }
}

export default CommunityRepository;
