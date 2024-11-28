import Joi from "joi";

export const createTaskSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name cannot be empty",
    }), 
    description: Joi.string().min(1).required().messages({
        "string.empty": "Description is required",
        "string.min": "Description cannot be empty",
    }), 
    attachment: Joi.optional(),
    status: Joi.string()
               .valid("todo", "doing", "finished")
               .optional()
               .messages({
                    "any.only": "Status must be one of: todo, doing, finished",
    }),
    assignees: Joi.optional(),
    createdBy: Joi.string().required().messages({
      "string.empty": "Creator is required",
    }),
    boardId: Joi.string().required().messages({
        "string.empty": "Board id is required",
    }),
})