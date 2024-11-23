import {
  ICommunity,
  ICommunityDto,
  IJoinCommunityDto,
} from "@/domain/interfaces/ICommunity";
import CommunityRepository from "@/domain/repository/community";
import { AppError } from "@/libs/app-error";
import { Service, Inject } from "typedi";

@Service()
class CommunityService {
  @Inject(() => CommunityRepository)
  private communityRepo!: CommunityRepository;

  /**
   * Creates a new community
   *
   * @param dto
   * @returns {Promise<ICommunity | undefined>}
   */
  public async createCommunity(
    dto: ICommunityDto,
  ): Promise<ICommunity | undefined> {
    try {
      console.log(dto);
      return this.communityRepo.create(dto);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error);
    }
  }

  /**
   * Gets community details by ID.
   *
   * @param communityId
   * @returns {Promise<ICommunity | undefined>}
   */
  public async getCommunityById(
    communityId: string,
  ): Promise<ICommunity | undefined> {
    try {
      return this.communityRepo.getById(communityId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error);
    }
  }

  /**
   * Joins a user to a community.
   *
   * @param dto
   */
  public async joinCommunity(dto: IJoinCommunityDto): Promise<void> {
    try {
      await this.communityRepo.join(dto);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error);
    }
  }
}

export default CommunityService;
