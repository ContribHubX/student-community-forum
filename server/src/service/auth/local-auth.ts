import { IUser, IUserLoginDto, IUserRegisterDto, IUserFullRegisterDto } from "@/domain/interfaces/IUser";
import UserRepository from "@/domain/repository/user";
import { AppError } from "@/libs/app-error";
import { Inject, Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { ILocalAuthService } from "@/domain/interfaces/IAuth";

@Service()
class LocalAuthService implements ILocalAuthService {
  @Inject(() => UserRepository)
  private userRepo!: UserRepository;

  /**
   * Registers a new user.
   * @param dto - User registration details.
   * @returns {Promise<void>}
   */
  public async register(dto: IUserRegisterDto): Promise<void> {
    try {
      const user = await this.userRepo.getByEmail(dto.email);

      if (user) throw new AppError("Email already exists", 402);

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      await this.userRepo.create({
        ...dto,
        id: uuidv4(),
        password: hashedPassword,
        provider: "LOCAL",
      } as IUserFullRegisterDto);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unexpected error during register");
    }
  }

  /**
   * Logs in a user.
   * @param dto - User login details.
   * @returns {Promise<IUser>}
   */
  public async login(dto: IUserLoginDto): Promise<IUser> {
    try {
      const user = await this.userRepo.getByEmail(dto.email);

      if (!user) throw new AppError("User not found", 404);
      if (!user.password) throw new AppError("Password is required", 400);

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new AppError("Invalid password", 401);

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unexpected error during login");
    }
  }

  /**
   * Retrieves user details.
   * @param dto - User login details.
   * @returns {Promise<IUser>}
   */
  public async getUserDetails(dto: IUserLoginDto): Promise<IUser> {
    try {
      return await this.userRepo.getDetails(dto);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unexpected error during login");
    }
  }
}

export default LocalAuthService;
