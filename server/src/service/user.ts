import { IUser } from "@/domain/interfaces/IUser";
import UserRepository from "@/domain/repository/user";
import { AppError } from "@/libs/app-error";
import { Inject, Service } from "typedi";

@Service()
class UserService {
    @Inject(() => UserRepository)
    private userRepo!: UserRepository;
     
    /**
     * Retrieves all users
     * 
     * @param 
     * @returns {Promise<IUser[]>}
     */
    public async getAllUsers(): Promise<IUser[]> {
        try {
            return await this.userRepo.getAll();
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error);
        }
    }
}

export default UserService;