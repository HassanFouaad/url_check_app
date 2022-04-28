import { Request, Response, NextFunction } from "express";
import Joi, { AnySchema } from "joi";

const validator =
  (schemaToValidate: AnySchema, toDelName?: string[]) =>
  (req: any, res: Response, next: NextFunction) => {
    const schema = Joi.object(schemaToValidate);
    const { query, body, method } = req;

    if (method == "DELETE" || method == "GET") {
      let { error } = schema.validate(query);

      if (error) {
        return res.status(422).json({
          error: {
            type: "query validation",
            key: error?.details[0]?.context?.key,
            message: error.details[0].message,
          },
          status: 422,
        });
      } else {
        next();
      }
    } else if (method == "POST" || method == "PUT") {
      let { error } = schema.validate(body);

      if (error) {
        return res.status(422).json({
          error: {
            type: "body validation",
            key: error?.details[0]?.context?.key,
            message: error.details[0].message,
          },
          status: 422,
        });
      }
      next();
    }
  };

export { validator };
