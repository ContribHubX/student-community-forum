import { mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { v4 as uuidV4 } from "uuid";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { StudyRoomTable } from "./study-room";

const ChatType = mysqlEnum("type", ["message", "indicator"]);

export const ChatTable = mysqlTable("chat", {
    id: varchar("id", { length: 255 }).primaryKey().$default(uuidV4),
    message: varchar("message", { length: 255 }).notNull(),
    type: ChatType.default("message"),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 })
      .references(() => UserTable.id)
      .notNull(),
    roomId: varchar("room_id", { length: 255 })
      .references(() => StudyRoomTable.id)
});


export const chatRelations = relations(ChatTable, ({ one }) => ({
    createdBy: one(UserTable, {
        fields: [ChatTable.createdBy],
        references: [UserTable.id]
    }),
    roomId: one(StudyRoomTable, {
        fields: [ChatTable.roomId],
        references: [StudyRoomTable.id]
    })
}))

