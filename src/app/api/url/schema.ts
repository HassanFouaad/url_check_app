import Joi from "joi";

export const createURLSchema: any = {
  name: Joi.string().max(255).required(),
  url: Joi.string().max(255).required(),
  protocol: Joi.string().valid("http", "https", "tcp").required(),
  path: Joi.string().max(255).optional(),
  port: Joi.number().port().optional(),
  webhook: Joi.string().uri(),
  timeout: Joi.number().default(5 * 1000),
  interval: Joi.number().default(10 * 1000 * 60),
  threshold: Joi.number().default(1),
  authentication: Joi.object().keys({
    username: Joi.string().required().max(255),
    password: Joi.string().required().max(255),
  }),
  httpHeaders: Joi.array().items(
    Joi.object()
      .keys({
        key: Joi.string().required().max(255),
        value: Joi.string().required().max(255),
      })
      .required()
  ),
  assert: Joi.object().keys({
    statusCode: Joi.number().required().max(599),
  }),
  ignoreSSL: Joi.boolean().required(),
  tags: Joi.array().items(Joi.string().max(255).required()),
};
