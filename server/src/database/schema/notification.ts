import { mysqlTable, varchar, timestamp, boolean, mysqlEnum } from "drizzle-orm/mysql-core";
import { v4 as uuidV4 } from "uuid";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";

export const EntityType = mysqlEnum("entity_type", ["thread", "task"]);
export const NotificationType = mysqlEnum("type", ["like", "dislike", "comment", "reply"]);

export const NotificationTable = mysqlTable("notification", {
    id: varchar("id", { length: 255 }).primaryKey().notNull().$default(uuidV4),
    message: varchar("message", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    entityId: varchar("entity_id", { length: 255 }).notNull(),
    entityType: EntityType.notNull(),
    type: NotificationType.notNull(),
    link: varchar("link", { length: 255 }).notNull(),
    isRead: boolean("is_read").$default(() => false),
    createdBy: varchar("created_by", { length: 255 }).notNull().references(() => UserTable.id),
    receiveBy: varchar("receive_by", { length: 255 }).notNull().references(() => UserTable.id),
});

export const NotificationTableRelations = relations(NotificationTable, ({ one }) => ({
    createdBy: one(UserTable, {
        fields: [NotificationTable.createdBy], 
        references: [UserTable.id], 
    }),
    receiveBy: one(UserTable, {
        fields: [NotificationTable.receiveBy], 
        references: [UserTable.id],
    }),
}));
