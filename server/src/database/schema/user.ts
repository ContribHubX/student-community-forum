import { relations } from "drizzle-orm";
import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { ThreadTable } from "./thread";

export const ProviderType = mysqlEnum("provider", [ "GOOGLE", "GITHUB" , "LOCAL"]);

export const UserTable = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: text("password"),
  provider: ProviderType.notNull().default("LOCAL"),
  attachment: varchar({ length: 255 }),
  updatedAt: timestamp().defaultNow(),
});

export const userRelations = relations(UserTable, ({ many }) => ({
  myThread: many(ThreadTable),
}));
