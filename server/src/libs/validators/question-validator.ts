import Joi from "joi";

export const createQuestionSchema = Joi.object({ 
    title: Joi.string().min(1).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title cannot be empty",
    }),          
    content: Joi.optional(),
    attachment: Joi.optional(),
    createdBy: Joi.string().required().messages({
        "string.empty": "Creator is required",
    }),
    topicId: Joi.optional(),
});


export const createRequestSchema = Joi.object({ 
    questionId: Joi.string().required().messages({
      "string.empty": "questionId is required",
      "string.min": "questionId cannot be empty",
    }),          
    requestedBy: Joi.string().required().messages({
      "string.empty": "requestedBy is required",
      "string.min": "requestedBy cannot be empty",
    }),
    requestedTo: Joi.string().required().messages({
        "string.empty": "requestedTo is required",
    }),
  });
  
