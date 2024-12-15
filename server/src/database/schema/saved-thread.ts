import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { ThreadTable } from "./";
import { v4 as uuidv4 } from "uuid";

export const SavedThreadTable = mysqlTable("saved_thread", {
  id: varchar("id", { length: 255 }).primaryKey().$default(uuidv4),
  userId: varchar("user_id", { length: 255 }).references(
    () => UserTable.id,
  ),
  threadId: varchar("thread_id", { length: 255 }).references(
    () => ThreadTable.id, { onDelete: "cascade" }
  ),
  savedAt: timestamp("created_at").defaultNow()
});


export const savedThreadTableRelations = relations(SavedThreadTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SavedThreadTable.userId],
    references: [UserTable.id],
  }),
  thread: one(ThreadTable, {
    fields: [SavedThreadTable.threadId],
    references: [ThreadTable.id],
  }),
}));



