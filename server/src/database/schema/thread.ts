import { mysqlTable, timestamp, varchar, text } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { CommunityTable } from "./community";
import { ThreadReaction as ThreadReactionTable, CommentTable } from "./";
import { v4 as uuidv4 } from "uuid";

export const ThreadTable = mysqlTable("thread", {
  id: varchar("id", { length: 255 }).primaryKey().$default(uuidv4),
  title: varchar("title", { length: 50 }).notNull(),
  content: text("content").notNull(),
  attachment: varchar("attachment", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 })
    .references(() => UserTable.id)
    .notNull(),
  communityId: varchar("community_id", { length: 255 }).references(
    () => CommunityTable.id,
  ),
});

export const threadRelations = relations(ThreadTable, ({ one, many }) => ({
  createdBy: one(UserTable, {
    fields: [ThreadTable.createdBy],
    references: [UserTable.id],
  }),
  community: one(CommunityTable, {
    fields: [ThreadTable.communityId],
    references: [CommunityTable.id],
  }),
  reactions: many(ThreadReactionTable),
  comments: many(CommentTable)
}));
