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
