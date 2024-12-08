import { mysqlTable, varchar, timestamp, text, mysqlEnum } from "drizzle-orm/mysql-core";
import { v4 as uuidV4} from "uuid";
import { UserTable } from "./user"; 
import { relations } from "drizzle-orm";
import { TaskTable } from "./task";

export const StatusType = mysqlEnum("status", ["active", "finished", "archieved"]);

export const BoardTable = mysqlTable("board", { 
    id: varchar("id", { length: 255 }).primaryKey().notNull().$default(uuidV4),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    status: StatusType.default("active"),
    createdBy: varchar("created_by", { length: 255 }).notNull().references(() => UserTable.id), 
})

export const boardRelations = relations(BoardTable, ({ one, many }) => ({
    createdBy: one(UserTable, {
        fields: [BoardTable.createdBy],
        references: [UserTable.id]
    }),
    members: many(BoardMembersTable),
    tasks: many(TaskTable)
}))


export const BoardMembersTable = mysqlTable("board_members", {
    id: varchar("id", { length: 255 }).primaryKey().notNull().$default(uuidV4),
    memberId: varchar("member_id", { length: 255 }).notNull().references(() => UserTable.id), 
    boardId: varchar("board_id", { length: 255 }).notNull().references(() => BoardTable.id, { onDelete: "cascade" })
})

export const boardMembersRelations = relations(BoardMembersTable, ({ one }) => ({
    member: one(UserTable, {
        fields: [BoardMembersTable.memberId],
        references: [UserTable.id]
    }),
    board: one(BoardTable, {
        fields: [BoardMembersTable.boardId],
        references: [BoardTable.id]
    })
}))