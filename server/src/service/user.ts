import UserRepository from "@/domain/repository/user";
import { Inject, Service } from "typedi";
import { IUser } from "@/domain/interfaces/IUser";

@Service()
class UserService {
    @Inject(() => UserRepository)
    private userRepo!: UserRepository;

    /**
     * GET user details
     */
    public async getMyDetails(userId: string): Promise<IUser> {
        const user = await this.userRepo.getUserDetails(userId);
        return user[0];
    }
}

export default UserService;