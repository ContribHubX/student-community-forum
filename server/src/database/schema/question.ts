import { boolean, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { v4 as uuidV4 } from "uuid";
import { UserTable } from "./user";
import { TopicTable } from "./topic";
import { relations } from "drizzle-orm";
import { ThreadTable } from "./thread";

export const VoteType = mysqlEnum("vote", ["up", "down"]);

export const QuestionTable = mysqlTable("question", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    title: varchar("title", { length: 100 }).notNull().unique(),
    content: text("content"),
    isDownvoted: boolean("is_downvoted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull(),
    topicId: varchar("topic_id", { length: 255 })
      .references(() => TopicTable.id)
});

export const QuestionVotesTable = mysqlTable("question_votes", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    userId: varchar("user_id", { length: 255 })
        .references(() => UserTable.id)
        .notNull(),
    questionId: varchar("question_id", { length: 255 })
        .references(() => QuestionTable.id)
        .notNull(),
    vote: VoteType
})

export const QuestionRequestTable = mysqlTable("question_request", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    questionId: varchar("question_id", { length: 255 })
        .references(() => QuestionTable.id)
        .notNull(),
    requestedBy: varchar("requested_by", { length: 255 })
        .references(() => UserTable.id)
        .notNull(),
    requestedTo: varchar("requested_to", { length: 255 })
        .references(() => UserTable.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

export const questionRelations = relations(QuestionTable, ({ one, many }) => ({
    createdBy: one(UserTable, {
        fields: [QuestionTable.createdBy],
        references: [UserTable.id]
    }),
    topic: one(TopicTable, {
        fields: [QuestionTable.topicId],
        references: [TopicTable.id]
    }),
    requests: many(QuestionRequestTable),
    threads: many(ThreadTable)
}))

export const questionReqRelations = relations(QuestionRequestTable, ({ one }) => ({
    question: one(QuestionTable, {
        fields: [QuestionRequestTable.questionId],
        references: [QuestionTable.id]
    }),
    requestedBy: one(UserTable, {
        fields: [QuestionRequestTable.requestedBy],
        references: [UserTable.id]
    }),
    requestedTo: one(UserTable, {
        fields: [QuestionRequestTable.requestedTo],
        references: [UserTable.id]
    }),
}))