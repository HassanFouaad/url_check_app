import Joi from "joi";

export const pushoverCallbackSchema: any = {
  userId: Joi.number().required(),
  pushover_user_key: Joi.string().required(),
};
