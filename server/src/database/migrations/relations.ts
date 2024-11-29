import { relations } from "drizzle-orm/relations";
import { user, board, boardMembers, comment, thread, community, notification, question, topics, questionRequest, questionVotes, task, taskAssignee, threadReaction, topicFollowers, userCommunities } from "./schema";

export const boardRelations = relations(board, ({one, many}) => ({
	user: one(user, {
		fields: [board.createdBy],
		references: [user.id]
	}),
	boardMembers: many(boardMembers),
	tasks: many(task),
}));

export const userRelations = relations(user, ({many}) => ({
	boards: many(board),
	boardMembers: many(boardMembers),
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
	questionVotes: many(questionVotes),
	tasks: many(task),
	taskAssignees: many(taskAssignee),
	threads: many(thread),
	threadReactions: many(threadReaction),
	topicFollowers: many(topicFollowers),
	topics: many(topics),
	userCommunities: many(userCommunities),
}));

export const boardMembersRelations = relations(boardMembers, ({one}) => ({
	board: one(board, {
		fields: [boardMembers.boardId],
		references: [board.id]
	}),
	user: one(user, {
		fields: [boardMembers.memberId],
		references: [user.id]
	}),
}));

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
	threadReactions_threadId: many(threadReaction, {
		relationName: "threadReaction_threadId_thread_id"
	}),
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
	questionVotes: many(questionVotes),
	threads: many(thread),
}));

export const topicsRelations = relations(topics, ({one, many}) => ({
	questions: many(question),
	threads: many(thread),
	topicFollowers: many(topicFollowers),
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

export const questionVotesRelations = relations(questionVotes, ({one}) => ({
	question: one(question, {
		fields: [questionVotes.questionId],
		references: [question.id]
	}),
	user: one(user, {
		fields: [questionVotes.userId],
		references: [user.id]
	}),
}));

export const taskRelations = relations(task, ({one, many}) => ({
	board: one(board, {
		fields: [task.boardId],
		references: [board.id]
	}),
	user: one(user, {
		fields: [task.createdBy],
		references: [user.id]
	}),
	taskAssignees: many(taskAssignee),
}));

export const taskAssigneeRelations = relations(taskAssignee, ({one}) => ({
	user: one(user, {
		fields: [taskAssignee.assigneeId],
		references: [user.id]
	}),
	task: one(task, {
		fields: [taskAssignee.taskId],
		references: [task.id]
	}),
}));

export const threadReactionRelations = relations(threadReaction, ({one}) => ({
	thread_threadId: one(thread, {
		fields: [threadReaction.threadId],
		references: [thread.id],
		relationName: "threadReaction_threadId_thread_id"
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