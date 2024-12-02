import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { v4 as uuidV4 } from "uuid";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { ChatTable } from "./chat";

export const StudyRoomTable = mysqlTable("study_room", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    attachment: text("attachment"),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull(),
});


export const studyRoomRelations = relations(StudyRoomTable, ({ one, many }) => ({
    createdBy: one(UserTable, {
        fields: [StudyRoomTable.createdBy],
        references: [UserTable.id]
    }),
    chats: many(ChatTable)
}));

