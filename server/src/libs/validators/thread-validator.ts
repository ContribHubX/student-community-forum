import Joi from "joi";

export const threadSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title cannot be empty",
  }),
  content: Joi.string().min(1).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content cannot be empty",
  }),
  attachment: Joi.string().optional().allow(""),
  createdBy: Joi.string().required().messages({
    "string.empty": "Creator is required",
  }),
});

export const threadReactionSchema = Joi.object({
  threadId: Joi.string().min(1).required().messages({
    "string.empty": "threadId is required",
    "string.min": "threadId cannot be empty",
  }),
  userId: Joi.string().min(1).required().messages({
    "string.empty": "userId is required",
    "string.min": "userId cannot be empty",
  }),
  type: Joi.string().valid("LIKE", "DISLIKE").required().messages({
    "any.only": "type must be either LIKE or DISLIKE",
    "string.empty": "type is required",
  }),
});

export const threadCommentSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    "string.empty": "content is required",
    "string.min": "content cannot be empty",
  }),
  createdBy: Joi.string().required().messages({
    "string.empty": "createdBy is required",
    "string.min": "createdBy cannot be empty",
  }),
  threadId: Joi.string().required().messages({
    "string.empty": "threadId is required",
    "string.min": "threadId cannot be empty",
  }),
  parentId: Joi.optional()
});
