import { ICommunity, ICommunityDto, IJoinCommunityDto } from "@/domain/interfaces/ICommunity";
import { IUser } from "@/domain/interfaces/IUser";
import CommunityRepository from "@/domain/repository/community";
import { AppError } from "@/libs/app-error";
import EventManager from "@/pubsub/event-manager";
import { Service, Inject } from "typedi";

@Service()
class CommunityService {
    @Inject(() => CommunityRepository) 
    private communityRepo!: CommunityRepository; 
    
    @Inject(() => EventManager)
    private eventManager!:EventManager;

    /**
     * Creates a new community
     * 
     * @param dto 
     * @returns {Promise<ICommunity | undefined>}
     */
    public async createCommunity(dto: ICommunityDto): Promise<ICommunity | undefined> {
        try {
            return this.communityRepo.create(dto);
        } catch(error: any) {
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
    public async getCommunityById(communityId: string): Promise<ICommunity | undefined> {
        try {
            return this.communityRepo.getById(communityId);
        } catch(error: any) {
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
            const result = await this.communityRepo.join(dto);
            this.eventManager.publishToMany<object>("join-community--new", { communityId: result });
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error); 
        }
    }

    public async getUserCommunities(userId: string): Promise<ICommunity[]> {
        try {
            return await this.communityRepo.getUserCommunities(userId);
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error); 
        }
    }

    public async getAllCommunities(): Promise<ICommunity[]> {
        try {
            return await this.communityRepo.getAll();
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error); 
        }
    }

    public async getCommunityMembers(communityId: string): Promise<IUser[]> {
        try {
            return await this.communityRepo.getMembers(communityId);
        } catch(error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error); 
        }
    }

}

export default CommunityService;