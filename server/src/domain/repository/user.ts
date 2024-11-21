import Container, { Service } from "typedi";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";
import { UserTable } from "@/database/schema";
import { AppError } from "@/libs/app-error";
import * as schema from "@/database/schema";
import { IUser, IUserFullRegisterDto, IUserLoginDto } from "../interfaces/IUser";

@Service()
class UserRepository {
  private db: MySql2Database<typeof schema>;

  constructor() {
    this.db = Container.get("database");
  }

  /**
   * Creates a new user in the database.
   * 
   * @param dto - Data transfer object containing user details for registration.
   * @returns A promise that resolves when the user is created.
   */
  public create(dto: IUserFullRegisterDto): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.insert(UserTable).values({ ...dto });
        resolve();
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }

  /**
   * Retrieves a user by email.
   * 
   * @param email - The email of the user to retrieve.
   * @returns A promise that resolves to the user data.
   */
  public getByEmail(email: string): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.db.query.UserTable.findFirst({
          where: eq(UserTable.email, email),
        });

        resolve(user as IUser);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }

  /**
   * Retrieves user details for login.
   * 
   * @param dto - Data transfer object containing email and password.
   * @returns A promise that resolves to the user data.
   */
  public getDetails(dto: IUserLoginDto): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.db.query.UserTable.findFirst({
          where: and(eq(UserTable.email, dto.email), eq(UserTable.password, dto.password)),
        });

        resolve(user as IUser);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }

  /**
   * Retrieves user details for login.
   * 
   * @param dto - Data transfer object containing email and password.
   * @returns A promise that resolves to the user data.
   */
  public getById(id: string): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.db.query.UserTable.findFirst({
          where: and(eq(UserTable.id, id)),
        });

        resolve(user as IUser);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }

  
  /**
   * Retrieves all users
   * 
   * @param 
   * @returns A promise that resolves to all users.
   */
  public getAll(): Promise<IUser[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.db.query.UserTable.findMany({})
        resolve(users as IUser[]);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }

  /**
   * Updates user information in the database.
   * 
   * @param dto - Data transfer object containing updated user details.
   * @returns A promise that resolves to the updated user data.
   */
  public update(dto: IUserFullRegisterDto): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      const { name, email, password, provider, attachment } = dto;
      
      try {
        const user = await this.db.update(UserTable).set({
          name,
          email,
          password,
          provider,
          attachment,
        }).where(eq(UserTable.id, dto.id));

        resolve(user as unknown as IUser);
      } catch (error: any) {
        reject(new AppError(error, 500));
      }
    });
  }
}

export default UserRepository;
