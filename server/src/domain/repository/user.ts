import Container, { Service } from "typedi";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { usersTable as User } from "@/database/schema";

@Service()
class UserRepository {
    private db: MySql2Database;

    constructor() {
        this.db = Container.get("db");
    }
    
    public async getUserDetails(userId: string) {
        const user = this.db.select().from(User).where(eq(User.id, userId));
        return user;
    }
}

export default UserRepository;