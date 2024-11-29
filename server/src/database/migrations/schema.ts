import { mysqlTable, mysqlSchema, AnyMySqlColumn, tinyint, foreignKey, primaryKey, varchar, text, timestamp, mysqlEnum, unique, int, mediumtext } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const board = mysqlTable("board", {
	id: varchar({ length: 255 }).notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`(now())`),
	status: mysqlEnum(['active','finished','archieved']).default('active'),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
},
(table) => {
	return {
		boardId: primaryKey({ columns: [table.id], name: "board_id"}),
	}
});

export const boardMembers = mysqlTable("board_members", {
	id: varchar({ length: 255 }).notNull(),
	memberId: varchar("member_id", { length: 255 }).notNull().references(() => user.id),
	boardId: varchar("board_id", { length: 255 }).notNull().references(() => board.id),
},
(table) => {
	return {
		boardMembersId: primaryKey({ columns: [table.id], name: "board_members_id"}),
	}
});

export const comment = mysqlTable("comment", {
	id: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	threadId: varchar("thread_id", { length: 255 }).notNull().references(() => thread.id),
	parentId: varchar("parent_id", { length: 255 }),
},
(table) => {
	return {
		commentParentIdCommentIdFk: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "comment_parent_id_comment_id_fk"
		}),
		commentId: primaryKey({ columns: [table.id], name: "comment_id"}),
	}
});

export const community = mysqlTable("community", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 255 }),
	banner: varchar({ length: 255 }),
	icon: varchar({ length: 255 }),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
},
(table) => {
	return {
		communityId: primaryKey({ columns: [table.id], name: "community_id"}),
		communityNameUnique: unique("community_name_unique").on(table.name),
	}
});

export const notification = mysqlTable("notification", {
	id: varchar({ length: 255 }).notNull(),
	message: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	entityId: varchar("entity_id", { length: 255 }).notNull(),
	entityType: mysqlEnum("entity_type", ['thread','task','question']).notNull(),
	type: mysqlEnum(['like','dislike','comment','reply','request']).notNull(),
	link: varchar({ length: 255 }).notNull(),
	isRead: tinyint("is_read"),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	receiveBy: varchar("receive_by", { length: 255 }).notNull().references(() => user.id),
},
(table) => {
	return {
		notificationId: primaryKey({ columns: [table.id], name: "notification_id"}),
	}
});

export const question = mysqlTable("question", {
	id: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 100 }).notNull(),
	content: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	topicId: varchar("topic_id", { length: 255 }).references(() => topics.id),
	isDownvoted: tinyint("is_downvoted").default(0),
},
(table) => {
	return {
		questionId: primaryKey({ columns: [table.id], name: "question_id"}),
		questionTitleUnique: unique("question_title_unique").on(table.title),
	}
});

export const questionRequest = mysqlTable("question_request", {
	id: varchar({ length: 255 }).notNull(),
	questionId: varchar("question_id", { length: 255 }).notNull().references(() => question.id),
	requestedBy: varchar("requested_by", { length: 255 }).notNull().references(() => user.id),
	requestedTo: varchar("requested_to", { length: 255 }).notNull().references(() => user.id),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
},
(table) => {
	return {
		questionRequestId: primaryKey({ columns: [table.id], name: "question_request_id"}),
	}
});

export const questionVotes = mysqlTable("question_votes", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id),
	questionId: varchar("question_id", { length: 255 }).notNull().references(() => question.id),
	vote: mysqlEnum(['up','down']),
},
(table) => {
	return {
		questionVotesId: primaryKey({ columns: [table.id], name: "question_votes_id"}),
	}
});

export const task = mysqlTable("task", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	description: text(),
	attachment: text(),
	status: mysqlEnum(['todo','doing','finished']).default('todo'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	boardId: varchar("board_id", { length: 255 }).notNull().references(() => board.id),
	sequence: int(),
},
(table) => {
	return {
		taskId: primaryKey({ columns: [table.id], name: "task_id"}),
	}
});

export const taskAssignee = mysqlTable("task_assignee", {
	id: varchar({ length: 255 }).notNull(),
	assigneeId: varchar("assignee_id", { length: 255 }).notNull().references(() => user.id),
	taskId: varchar("task_id", { length: 255 }).notNull().references(() => task.id),
},
(table) => {
	return {
		taskAssigneeId: primaryKey({ columns: [table.id], name: "task_assignee_id"}),
	}
});

export const thread = mysqlTable("thread", {
	id: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 50 }).notNull(),
	content: mediumtext().notNull(),
	attachment: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	communityId: varchar("community_id", { length: 255 }).references(() => community.id),
	topicId: varchar("topic_id", { length: 255 }).references(() => topics.id),
	questionId: varchar("question_id", { length: 255 }).references(() => question.id),
},
(table) => {
	return {
		threadId: primaryKey({ columns: [table.id], name: "thread_id"}),
	}
});

export const threadReaction = mysqlTable("thread_reaction", {
	id: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['LIKE','DISLIKE']).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id),
	threadId: varchar("thread_id", { length: 255 }).notNull().references(() => thread.id).references(() => thread.id),
},
(table) => {
	return {
		threadReactionId: primaryKey({ columns: [table.id], name: "thread_reaction_id"}),
	}
});

export const threadTags = mysqlTable("thread_tags", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	threadId: varchar("thread_id", { length: 255 }),
},
(table) => {
	return {
		threadTagsId: primaryKey({ columns: [table.id], name: "thread_tags_id"}),
	}
});

export const topicFollowers = mysqlTable("topic_followers", {
	id: varchar({ length: 255 }).notNull(),
	followerId: varchar("follower_id", { length: 255 }).notNull().references(() => user.id),
	topicId: varchar("topic_id", { length: 255 }).notNull().references(() => topics.id),
},
(table) => {
	return {
		topicFollowersId: primaryKey({ columns: [table.id], name: "topic_followers_id"}),
	}
});

export const topics = mysqlTable("topics", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	attachment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
},
(table) => {
	return {
		topicsId: primaryKey({ columns: [table.id], name: "topics_id"}),
	}
});

export const user = mysqlTable("user", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text(),
	provider: mysqlEnum(['GOOGLE','GITHUB','LOCAL']).default('LOCAL').notNull(),
	attachment: varchar({ length: 255 }),
	updatedAt: timestamp({ mode: 'string' }).default(sql`(now())`),
},
(table) => {
	return {
		userId: primaryKey({ columns: [table.id], name: "user_id"}),
	}
});

export const userCommunities = mysqlTable("user_communities", {
	userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id),
	communityId: varchar("community_id", { length: 255 }).notNull().references(() => community.id),
	joinedAt: timestamp("joined_at", { mode: 'string' }).default(sql`(now())`),
});
