import Joi from "joi";

export const createTopicSchema = Joi.object({
    name: Joi.string().min(1).required().messages({
      "string.empty": "name is required",
      "string.min": "name cannot be empty",
    }),
    attachment: Joi.optional(),
    createdBy: Joi.string().required().messages({
      "string.empty": "createdBy is required",
    }),
});

export const followTopicSchema= Joi.object({
    followerId: Joi.string().min(1).required().messages({
      "string.empty": "followerId is required",
      "string.min": "followerId cannot be empty",
    }),
    topicId: Joi.string().required().messages({
      "string.empty": "topicId is required",
      "string.min": "topicId cannot be empty",
    }),
});