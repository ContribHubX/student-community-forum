import Joi from "joi";

export const createBoardSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name cannot be empty",
    }), 
    createdBy: Joi.string().required().messages({
      "string.empty": "Creator is required",
    }),
})