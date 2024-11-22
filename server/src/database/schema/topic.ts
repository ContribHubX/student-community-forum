import { mysqlTable, timestamp, varchar, text } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";
import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";

export const TopicTable = mysqlTable("topics", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidv4),
    name: varchar("name", { length: 50 }).notNull(),
    attachment: text("attachment"),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull()
});

export const TopicFollowersTable = mysqlTable("topic_followers", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidv4),
    followerId: varchar("follower_id", { length: 255 }).references(() => UserTable.id).notNull(),
    topicId: varchar("topic_id", { length: 255 }).references(() => TopicTable.id).notNull(),
})   

export const topicsRelations = relations(TopicTable, ({ one, many }) => ({
    createdBy: one(UserTable, {
        fields: [TopicTable.createdBy],
        references: [UserTable.id]
    }),
    followers: many(TopicFollowersTable)
}))

export const TopicFollowersTableRelations = relations(TopicFollowersTable, ({ one, many }) => ({
    user: one(UserTable, {
        fields: [TopicFollowersTable.followerId],
        references: [UserTable.id]
    }),
    topic: one(TopicTable, {
        fields: [TopicFollowersTable.topicId],
        references: [TopicTable.id]
    }),
}))