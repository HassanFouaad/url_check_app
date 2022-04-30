import Joi from "joi";
export const readURLSchema: any = {
  urlId: Joi.number().positive().integer().required(),
};

export const createURLSchema: any = {
  name: Joi.string().max(255).required(),
  url: Joi.string().max(255).required(),
  protocol: Joi.string().valid("http", "https", "tcp").required(),
  path: Joi.string().max(255).optional(),
  port: Joi.number().port().optional(),
  webhook: Joi.string().uri(),
  timeout: Joi.number(),
  interval: Joi.number().min(1000),
  threshold: Joi.number().default(1),
  authentication: Joi.object().keys({
    username: Joi.string().required().max(255),
    password: Joi.string().required().max(500),
  }),
  httpHeaders: Joi.array().items(
    Joi.object()
      .keys({
        key: Joi.string().required().max(255),
        value: Joi.string().required().max(25500),
      })
      .required()
  ),
  assert: Joi.object().keys({
    statusCode: Joi.number().required().max(599),
  }),
  ignoreSSL: Joi.boolean().required(),
  tags: Joi.array().items(Joi.string().max(255).required()),
};

export const updateURLSchema: any = {
  urlId: Joi.number().positive().integer().required(),

  name: Joi.string().max(255).optional(),
  url: Joi.string().max(255).optional(),
  protocol: Joi.string().valid("http", "https", "tcp").optional(),
  path: Joi.string().max(255).optional().allow(null),
  port: Joi.number().port().optional().allow(null),
  webhook: Joi.string().uri().allow(null),
  timeout: Joi.number(),
  interval: Joi.number().min(1000),
  threshold: Joi.number().default(1),
  authentication: Joi.object()
    .keys({
      username: Joi.string().required().max(255),
      password: Joi.string().required().max(500),
    })
    .allow(null),
  httpHeaders: Joi.array()
    .items(
      Joi.object()
        .keys({
          key: Joi.string().required().max(255),
          value: Joi.string().required().max(25500),
        })
        .required()
    )
    .allow(null),
  assert: Joi.object()
    .keys({
      statusCode: Joi.number().required().max(599),
    })
    .allow(null),
  ignoreSSL: Joi.boolean(),
  tags: Joi.array().items(Joi.string().max(255).required()).allow(null),
};

export const deleteURLSchema: any = {
  urlId: Joi.number().positive().integer().required(),
};
