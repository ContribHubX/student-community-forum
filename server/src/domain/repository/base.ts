// import * as schema from "@/database/schema";
// import { AppError } from "@/libs/app-error";
// import { eq, Relation } from "drizzle-orm";
// import { MySqlTable, MySqlTableWithColumns, TableConfig } from "drizzle-orm/mysql-core";
// import { MySql2Database } from "drizzle-orm/mysql2";
// import Container from "typedi";

// class BaseRepository {
//     protected db: MySql2Database<typeof schema>;

//     constructor() {
//         this.db = Container.get("database");
//     }

//     protected async insertAndReturnId<T extends object>(table: MySqlTable, dto: T): Promise<string | undefined> {
//         try {
//             const result = await this.db
//                 .insert(table)
//                 .values({ ...dto })
//                 .$returningId();

//             return (result[0] as any).id as unknown as string;
//         } catch (error: any) {
//             throw new AppError(error);
//         }
//     }

//     protected async findById<T>(table: MySqlTableWithColumns<TableConfig>, id: string, relations: Relation): Promise<T | undefined> {
//         try {
//             const result = await this.db
//                 .query
//                 .(table)
//                 .findFirst({
//                     where: { id },
//                     with: relations
//                 });
//             return result as T;
//         } catch (error: any) {
//             throw new AppError(error);
//         }
//     }
// }

// export default BaseRepository;