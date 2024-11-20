import { relations } from "drizzle-orm/relations";
import { user, comment, thread, community, notification, threadReaction, topicFollowers, topics, userCommunities } from "./schema";

export const commentRelations = relations(comment, ({one, many}) => ({
	user: one(user, {
		fields: [comment.createdBy],
		references: [user.id]
	}),
	comment: one(comment, {
		fields: [comment.parentId],
		references: [comment.id],
		relationName: "comment_parentId_comment_id"
	}),
	comments: many(comment, {
		relationName: "comment_parentId_comment_id"
	}),
	thread: one(thread, {
		fields: [comment.threadId],
		references: [thread.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	comments: many(comment),
	communities: many(community),
	notifications_createdBy: many(notification, {
		relationName: "notification_createdBy_user_id"
	}),
	notifications_receiveBy: many(notification, {
		relationName: "notification_receiveBy_user_id"
	}),
	threads: many(thread),
	threadReactions: many(threadReaction),
	topicFollowers: many(topicFollowers),
	topics: many(topics),
	userCommunities: many(userCommunities),
}));

export const threadRelations = relations(thread, ({one, many}) => ({
	comments: many(comment),
	community: one(community, {
		fields: [thread.communityId],
		references: [community.id]
	}),
	user: one(user, {
		fields: [thread.createdBy],
		references: [user.id]
	}),
	threadReactions: many(threadReaction),
}));

export const communityRelations = relations(community, ({one, many}) => ({
	user: one(user, {
		fields: [community.createdBy],
		references: [user.id]
	}),
	threads: many(thread),
	userCommunities: many(userCommunities),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user_createdBy: one(user, {
		fields: [notification.createdBy],
		references: [user.id],
		relationName: "notification_createdBy_user_id"
	}),
	user_receiveBy: one(user, {
		fields: [notification.receiveBy],
		references: [user.id],
		relationName: "notification_receiveBy_user_id"
	}),
}));

export const threadReactionRelations = relations(threadReaction, ({one}) => ({
	thread: one(thread, {
		fields: [threadReaction.threadId],
		references: [thread.id]
	}),
	user: one(user, {
		fields: [threadReaction.userId],
		references: [user.id]
	}),
}));

export const topicFollowersRelations = relations(topicFollowers, ({one}) => ({
	user: one(user, {
		fields: [topicFollowers.followerId],
		references: [user.id]
	}),
	topic: one(topics, {
		fields: [topicFollowers.topicId],
		references: [topics.id]
	}),
}));

export const topicsRelations = relations(topics, ({one, many}) => ({
	topicFollowers: many(topicFollowers),
	user: one(user, {
		fields: [topics.createdBy],
		references: [user.id]
	}),
}));

export const userCommunitiesRelations = relations(userCommunities, ({one}) => ({
	community: one(community, {
		fields: [userCommunities.communityId],
		references: [community.id]
	}),
	user: one(user, {
		fields: [userCommunities.userId],
		references: [user.id]
	}),
}));