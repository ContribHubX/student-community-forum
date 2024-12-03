import Joi from "joi";

// Study Room Validators

export const createStudyRoomSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
        "string.empty": "Study room name is required",
        "string.min": "Study room name cannot be empty",
    }),
    description: Joi.string().optional().allow(""),
    attachment: Joi.string().optional().allow(""),
    createdBy: Joi.string().required().messages({
        "string.empty": "Creator ID is required",
    }),
});

// To-Do Validators

export const createTodoSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
        "string.empty": "Todo name is required",
        "string.min": "Todo name cannot be empty",
    }),
    createdBy: Joi.string().required().messages({
        "string.empty": "Creator ID is required",
    }),
});

export const updateTodoSchema = Joi.object({
    todoId: Joi.string().required().messages({
        "string.empty": "Todo ID is required",
    }),
    isDone: Joi.boolean().required().messages({
        "any.required": "Todo completion status is required",
    })
});

// Chat Validators

export const createChatSchema = Joi.object({
    message: Joi.string().allow("").optional(),
    type: Joi.string().valid("message", "indicator").required().messages({
        "any.only": "Chat type must be one of 'message', or 'indicator'",
        "any.required": "Chat type is required",
    }),
    roomId: Joi.string().required().messages({
        "string.empty": "Room ID is required",
    }),
    createdBy: Joi.string().required().messages({
        "string.empty": "Creator ID is required",
    }),
});
