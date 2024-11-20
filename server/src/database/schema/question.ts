import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { v4 as uuidV4 } from "uuid";
import { UserTable } from "./user";
import { TopicTable } from "./topic";
import { relations } from "drizzle-orm";

export const QuestionTable = mysqlTable("question", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    title: varchar("title", { length: 100 }).notNull().unique(),
    content: varchar("content", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull(),
    topicId: varchar("topic_id", { length: 255 })
      .references(() => TopicTable.id)
});

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
    topic: one(UserTable, {
        fields: [QuestionTable.createdBy],
        references: [UserTable.id]
    }),
    requests: many(QuestionRequestTable)
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