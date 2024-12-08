import { relations } from "drizzle-orm/relations";
import { user, board, boardMembers, chat, studyRoom, comment, thread, community, notification, question, topics, questionRequest, questionVotes, task, taskAssignee, threadReaction, threadTags, todo, topicFollowers } from "./schema";

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
	chats: many(chat),
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
	studyRooms: many(studyRoom),
	tasks: many(task),
	taskAssignees: many(taskAssignee),
	threads: many(thread),
	threadReactions: many(threadReaction),
	todos: many(todo),
	topicFollowers: many(topicFollowers),
	topics: many(topics),
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

export const chatRelations = relations(chat, ({one}) => ({
	user: one(user, {
		fields: [chat.createdBy],
		references: [user.id]
	}),
	studyRoom: one(studyRoom, {
		fields: [chat.roomId],
		references: [studyRoom.id]
	}),
}));

export const studyRoomRelations = relations(studyRoom, ({one, many}) => ({
	chats: many(chat),
	user: one(user, {
		fields: [studyRoom.createdBy],
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
	threadReactions: many(threadReaction),
	threadTags: many(threadTags),
}));

export const communityRelations = relations(community, ({one, many}) => ({
	user: one(user, {
		fields: [community.createdBy],
		references: [user.id]
	}),
	threads: many(thread),
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
	thread: one(thread, {
		fields: [threadReaction.threadId],
		references: [thread.id]
	}),
	user: one(user, {
		fields: [threadReaction.userId],
		references: [user.id]
	}),
}));

export const threadTagsRelations = relations(threadTags, ({one}) => ({
	thread: one(thread, {
		fields: [threadTags.threadId],
		references: [thread.id]
	}),
}));

export const todoRelations = relations(todo, ({one}) => ({
	user: one(user, {
		fields: [todo.createdBy],
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