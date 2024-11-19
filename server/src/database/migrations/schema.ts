import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, varchar, text, timestamp, unique, mysqlEnum, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

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
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	icon: varchar({ length: 255 }),
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
	entityType: mysqlEnum("entity_type", ['thread','task']).notNull(),
	type: mysqlEnum(['like','dislike','comment','reply']).notNull(),
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

export const thread = mysqlTable("thread", {
	id: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 50 }).notNull(),
	content: text().notNull(),
	attachment: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`),
	createdBy: varchar("created_by", { length: 255 }).notNull().references(() => user.id),
	communityId: varchar("community_id", { length: 255 }).references(() => community.id),
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
	threadId: varchar("thread_id", { length: 255 }).notNull().references(() => thread.id),
},
(table) => {
	return {
		threadReactionId: primaryKey({ columns: [table.id], name: "thread_reaction_id"}),
	}
});

export const topicFollowers = mysqlTable("topic_followers", {
	followerId: varchar("follower_id", { length: 255 }).notNull().references(() => user.id),
	topicId: varchar("topic_id", { length: 255 }).notNull().references(() => topics.id),
});

export const topics = mysqlTable("topics", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	attachment: varchar({ length: 255 }),
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
	attachment: varchar({ length: 255 }),
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
