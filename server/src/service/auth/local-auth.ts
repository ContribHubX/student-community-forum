import { IUser, IUserLoginDto, IUserRegisterDto, IUserFullRegisterDto } from "@/domain/interfaces/IUser";
import UserRepository from "@/domain/repository/user";
import { AppError } from "@/libs/app-error";
import { Inject, Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { ILocalAuthService } from "@/domain/interfaces/IAuth";
import jwt from "jsonwebtoken";
import { AuthResponse } from "@/types";

@Service()
class LocalAuthService implements ILocalAuthService {
  @Inject(() => UserRepository)
  private userRepo!: UserRepository;

  private jwtSecret = process.env.JWT_SECRET || "defaultSecretKey"; 
  private jwtExpiresIn = "1h";

  /**
   * Registers a new user.
   * 
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
   * Logs in a user and generates a JWT.
   * 
   * @param dto - User login details.
   * @returns {Promise<{ user: IUser; token: string }>}
   */
  public async login(dto: IUserLoginDto): Promise<{ user: IUser; token: string }> {
      try {
        const user = await this.userRepo.getByEmail(dto.email);

        if (!user) throw new AppError("User not found", 404);
        if (!user.password) throw new AppError("Password is required", 400);

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new AppError("Invalid password", 401);

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          this.jwtSecret,
          { expiresIn: this.jwtExpiresIn }
        );

        return { user, token };
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Unexpected error during login");
      }
  }

  /**
   * Retrieves user details.
   * 
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


   /**
   * Retrieves user details based on JWT stored in the database.
   * 
   * @param token - The JWT token sent in the request header.
   * @returns {Promise<IUser>}
   */
  public async getUserDetailsFromToken(token: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string; email: string };
      
      if (!decoded.id) throw new AppError("User ID not found in token", 401);
      
      const user = await this.userRepo.getById(decoded.id);
      
      if (!user) throw new AppError("User not found", 404);
      
      return { user, accessToken: token};
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Invalid or expired token", 401);
    }
  }
}

export default LocalAuthService;
