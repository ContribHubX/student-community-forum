import Joi from "joi";

export const communitySchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name cannot be empty",
  }),
  description: Joi.string().min(1).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description cannot be empty",
  }),
  banner: Joi.string().optional().allow(""),
  icon: Joi.string().optional().allow(""),
  createdBy: Joi.string().required().messages({
    "string.empty": "Creator is required",
  }),
});


export const joinCommunitySchema = Joi.object({
  userId: Joi.string().min(1).required().messages({
    "string.empty": "userId is required",
    "string.min": "userId cannot be empty",
  }),
  communityId: Joi.string().min(1).required().messages({
    "string.empty": "communityId is required",
    "string.min": "communityId cannot be empty",
  })
});

