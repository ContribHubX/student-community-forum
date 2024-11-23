import { relations } from "drizzle-orm/relations";
import { user, comment, thread, community, notification, question, topics, questionRequest, threadReaction, userCommunities } from "./schema";

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
	questions: many(question),
	questionRequests_requestedBy: many(questionRequest, {
		relationName: "questionRequest_requestedBy_user_id"
	}),
	questionRequests_requestedTo: many(questionRequest, {
		relationName: "questionRequest_requestedTo_user_id"
	}),
	threads: many(thread),
	threadReactions: many(threadReaction),
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
	question: one(question, {
		fields: [thread.questionId],
		references: [question.id]
	}),
	topic: one(topics, {
		fields: [thread.topicId],
		references: [topics.id]
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

export const questionRelations = relations(question, ({one, many}) => ({
	user: one(user, {
		fields: [question.createdBy],
		references: [user.id]
	}),
	topic: one(topics, {
		fields: [question.topicId],
		references: [topics.id]
	}),
	questionRequests: many(questionRequest),
	threads: many(thread),
}));

export const topicsRelations = relations(topics, ({one, many}) => ({
	questions: many(question),
	threads: many(thread),
	user: one(user, {
		fields: [topics.createdBy],
		references: [user.id]
	}),
}));

export const questionRequestRelations = relations(questionRequest, ({one}) => ({
	question: one(question, {
		fields: [questionRequest.questionId],
		references: [question.id]
	}),
	user_requestedBy: one(user, {
		fields: [questionRequest.requestedBy],
		references: [user.id],
		relationName: "questionRequest_requestedBy_user_id"
	}),
	user_requestedTo: one(user, {
		fields: [questionRequest.requestedTo],
		references: [user.id],
		relationName: "questionRequest_requestedTo_user_id"
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