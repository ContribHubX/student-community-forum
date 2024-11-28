import { mysqlTable, timestamp, varchar, text } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { CommunityTable } from "./community";
import { ThreadReaction as ThreadReactionTable, CommentTable, TopicTable, QuestionTable } from "./";
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
  topicId: varchar("topic_id", { length: 255 }).references(
    () => TopicTable.id,
  ),
  questionId: varchar("question_id", { length: 255 }).references(
    () => QuestionTable.id,
  ),
});

export const ThreadTagsTable = mysqlTable("thread_tags", {
  id: varchar("id", { length: 255 }).primaryKey().$default(uuidv4),
  name: varchar("name", { length: 50 }).notNull(),
  threadId: varchar("thread_id", { length: 255 }).references(
    () => ThreadTable.id,
  ),
})

export const threadRelations = relations(ThreadTable, ({ one, many }) => ({
  createdBy: one(UserTable, {
    fields: [ThreadTable.createdBy],
    references: [UserTable.id],
  }),
  community: one(CommunityTable, {
    fields: [ThreadTable.communityId],
    references: [CommunityTable.id],
  }),
  topic: one(TopicTable, {
    fields: [ThreadTable.topicId],
    references: [TopicTable.id],
  }),
  question: one(QuestionTable, {
    fields: [ThreadTable.questionId],
    references: [QuestionTable.id],
  }),
  reactions: many(ThreadReactionTable),
  comments: many(CommentTable),
  tags: many(ThreadTagsTable)
}));


export const threadTagsRelations = relations(ThreadTagsTable, ({ one }) => ({
  thread: one(ThreadTable, {
    fields: [ThreadTagsTable.threadId],
    references: [ThreadTable.id],
  }),
 
}));

