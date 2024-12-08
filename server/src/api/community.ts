import { AppError } from "@/libs/app-error";
import { Request, Response, NextFunction } from "express";
import Container from "typedi";
import CommunityService from "@/service/community";


export default {
    /**
     * Handler to create community
     *
     * @route POST /community
     */
    async createCommunityHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const body = req.body;
        
        const bannerFile = (req.files as any)?.banner[0]?.path; 
        const iconFile = (req.files as any)?.icon[0]?.path;  

        try {
            if (bannerFile || iconFile) {
                req.body.banner = bannerFile;
                req.body.icon = iconFile;
            }

            const communityService = Container.get(CommunityService);
            const community = await communityService.createCommunity(body);
            res.status(200).json({message: "Community created", community});
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to join community
     *
     * @route POST /community/join
     */
    async joinCommunityHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const body = req.body;
    
        try {
            const communityService = Container.get(CommunityService);
            await communityService.joinCommunity(body);
            res.status(200).json({message: "Successfully joined"});
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve a community details
     *
     * @route GET /community/:communityId
     */
    async getCommunityHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const communityId = req.params.communityId;

        try {
            const communityService = Container.get(CommunityService);
            const response = await communityService.getCommunityById(communityId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },


    /**
     * Handler to retrieve a communities of user
     *
     * @route GET /community?userId
     */
     async getUserCommunitiesHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const userId = req.query.userId as string;

        try {
            const communityService = Container.get(CommunityService);
            const response = await communityService.getUserCommunities(userId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },


    /**
     * Handler to retrieve all communities
     *
     * @route GET /community
     */
    async getCommunitiesHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const communityService = Container.get(CommunityService);
            const response = await communityService.getAllCommunities();
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },

    /**
     * Handler to retrieve all members
     *
     * @route GET /community/members/:communityId
     */
    async getCommunityMembersHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const communityId = req.params.communityId;

        try {
            const communityService = Container.get(CommunityService);
            const response = await communityService.getCommunityMembers(communityId);
            res.status(200).json(response);
        } catch (error: any) {
            next(new AppError(error));
        }
    },
}