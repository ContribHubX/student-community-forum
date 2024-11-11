import { relations } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { UserTable } from "./user";

export const CommunityTable = mysqlTable("community", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  banner: varchar("banner", { length: 255 }),
  profilePicture: varchar("profile_picture", { length: 255 }),
  createdBy: varchar("created_by", { length: 255 })
    .references(() => UserTable.id)
    .notNull(),
});

export const communityRelations = relations(CommunityTable, ({ one }) => ({
  owner: one(UserTable, {
    fields: [CommunityTable.createdBy],
    references: [UserTable.id],
  }),
}));
