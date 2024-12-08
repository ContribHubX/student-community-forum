import { relations } from "drizzle-orm";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";
import { v4 as uuidV4 } from "uuid";
import { CommunityTable } from "./community";

export const CommunityEventTable = mysqlTable("community_event", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    name: varchar("name", { length: 255 }).notNull(),
    eventDate: timestamp("event_date"),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull(),
    communityId: varchar("community_id", { length: 255 })
        .references(() => CommunityTable.id)
        .notNull(),
});
  

export const communityEventRelations = relations(CommunityEventTable, ({ one, many }) => ({
    createdBy: one(UserTable, {
        fields: [CommunityEventTable.createdBy],
        references: [UserTable.id],
    }), 
    tags: many(CommunityEventTagsTable)
}))

export const CommunityEventTagsTable = mysqlTable("community_event_tags", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    name: varchar("name", { length: 255 }).notNull(),
    communityEventId: varchar("community_event_id", { length: 255 })
        .references(() => CommunityEventTable.id)
        .notNull(),
});

export const communityEventTagsRelations = relations(CommunityEventTagsTable, ({ one, many }) => ({
    community: one(CommunityEventTable, {
        fields: [CommunityEventTagsTable.communityEventId],
        references: [CommunityEventTable.id],
    }), 
}))
  

