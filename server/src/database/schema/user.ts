import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { ThreadTable } from "./thread";

export const UserTable = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  attachment: varchar({ length: 255 }),
});

export const userRelations = relations(UserTable, ({ many }) => ({
  myThread: many(ThreadTable),
}));
