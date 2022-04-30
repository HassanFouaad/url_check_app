import Joi from "joi";

export const loginSchema: any = {
  email: Joi.string().email().max(255).required(),
  password: Joi.string().max(255).required(),
};

export const registerSchema: any = {
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
};

export const emailVerificationSchema: any = {
  email: Joi.string().email().max(255).required(),
  vCode: Joi.string().max(5).min(5).required(),
};
