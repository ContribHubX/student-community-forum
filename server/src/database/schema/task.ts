import { mysqlTable, varchar, timestamp, text, mysqlEnum } from "drizzle-orm/mysql-core";
import { v4 as uuidV4} from "uuid";
import { UserTable } from "./user"; 
import { relations } from "drizzle-orm";
import { BoardTable } from "./board";

export const TaskStatusType = mysqlEnum("status", ["todo", "doing", "finished"]);

export const TaskTable = mysqlTable("task", { 
    id: varchar("id", { length: 255 }).primaryKey().notNull().$default(uuidV4),
    name: varchar("name", { length: 50 }).notNull(),
    description: varchar("description", { length: 50 }),
    attachment: text("attachment"),
    status: TaskStatusType.default("todo"),
    createdAt: timestamp("created_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 }).notNull().references(() => UserTable.id), 
    boardId: varchar("board_id", { length: 255 }).notNull().references(() => BoardTable.id), 
})

export const taskRelations = relations(TaskTable, ({ one, many }) => ({
    createdBy: one(UserTable, {
        fields: [TaskTable.createdBy],
        references: [UserTable.id]
    }),
    board: one(BoardTable, {
        fields: [TaskTable.boardId],
        references: [BoardTable.id]
    }),
    assignees: many(TaskAssigneeTable)
}))


export const TaskAssigneeTable = mysqlTable("task_assignee", {
    id: varchar("id", { length: 255 }).primaryKey().notNull().$default(uuidV4),
    assigneeId: varchar("assignee_id", { length: 255 }).notNull().references(() => UserTable.id), 
    taskId: varchar("task_id", { length: 255 }).notNull().references(() => TaskTable.id)
})

export const taskAssigneeRelations = relations(TaskAssigneeTable, ({ one }) => ({
    assignee: one(UserTable, {
        fields: [TaskAssigneeTable.assigneeId],
        references: [UserTable.id]
    }),
    task: one(TaskTable, {
        fields: [TaskAssigneeTable.taskId],
        references: [TaskTable.id]
    }),
}))