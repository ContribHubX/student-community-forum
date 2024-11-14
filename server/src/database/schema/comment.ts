import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { v4 as uuidV4} from "uuid";
import { UserTable } from "./user"; 
import { ThreadTable } from "./thread";
import { relations } from "drizzle-orm";

export const CommentTable = mysqlTable('comment', { 
    id: varchar("id", { length: 255 }).primaryKey().notNull().$default(uuidV4),
    content: varchar("content", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 }).notNull().references(() => UserTable.id),
    threadId: varchar("thread_id", { length: 255 }).notNull().references(() => ThreadTable.id) 
})

export const CommentTableRelations = relations(CommentTable, ({ one }) => ({
    thread: one(ThreadTable, {
        fields: [CommentTable.threadId],
        references: [ThreadTable.id]
    }),
    user: one(UserTable, {
        fields: [CommentTable.createdBy],
        references: [UserTable.id]
    }),
}))