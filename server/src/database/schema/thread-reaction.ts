import { mysqlEnum, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { v4 as uuidV4} from "uuid";
import { UserTable } from "./user"; 
import { ThreadTable } from "./thread";
import { relations } from "drizzle-orm";

export const ReactionType = mysqlEnum("type", ['LIKE', 'DISLIKE']);

export const ThreadReaction = mysqlTable('thread_reaction', { 
    id: varchar('id', { length: 255 }).primaryKey().notNull().$default(uuidV4),
    type: ReactionType.notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    userId: varchar("user_id", { length: 255 }).notNull().references(() => UserTable.id),
    threadId: varchar("thread_id", { length: 255 }).notNull().references(() => ThreadTable.id, { onDelete: "cascade" })
})

export const ThreadReactionRelations = relations(ThreadReaction, ({ one }) => ({
    thread: one(ThreadTable, {
        fields: [ThreadReaction.threadId],
        references: [ThreadTable.id]
    }),
    user: one(UserTable, {
        fields: [ThreadReaction.userId],
        references: [UserTable.id]
    }),
}))