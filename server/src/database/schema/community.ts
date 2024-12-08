import { relations } from "drizzle-orm";
import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";
import { v4 as uuidV4 } from "uuid";

export const CommunityTable = mysqlTable("community", {
  id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  banner: text("banner"),
  icon: text("icon"),
  createdBy: varchar("created_by", { length: 255 })
    .references(() => UserTable.id)
    .notNull(),
});

export const UsersCommunities = mysqlTable("user_communities", {
  id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => UserTable.id),
  communityId: varchar("community_id", { length: 255 }).notNull().references(() => CommunityTable.id),
  joinedAt: timestamp("joined_at").defaultNow()
})

export const communityRelations = relations(CommunityTable, ({ one, many }) => ({
  createdBy: one(UserTable, {
    fields: [CommunityTable.createdBy],
    references: [UserTable.id],
  }),
  members: many(UsersCommunities)
}));

export const usersCommunitiesRelations = relations(UsersCommunities, ({ one }) => ({
  community: one(CommunityTable, {
    fields: [UsersCommunities.communityId],
    references: [CommunityTable.id],
  }),
  user: one(UserTable, {
    fields: [UsersCommunities.userId],
    references: [UserTable.id]
  })
}));

