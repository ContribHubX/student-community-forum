import { boolean, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { v4 as uuidV4 } from "uuid";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";

export const TodoTable = mysqlTable("todo", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    name: varchar("name", { length: 100 }).notNull().unique(),
    isDone: boolean("is_done").default(false), 
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull(),
});

export const todoRelations = relations(TodoTable, ({ one }) => ({
    createdBy: one(UserTable, {
        fields: [TodoTable.createdBy],
        references: [UserTable.id]
    }),
}));

