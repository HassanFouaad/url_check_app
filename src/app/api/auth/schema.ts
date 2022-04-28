import Joi from "joi";

export const loginSchema: any = {
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
};
