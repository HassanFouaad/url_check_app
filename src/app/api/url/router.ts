import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import { createURLSchema } from "./schema";

import { createURLController } from "./controllers";
import { isAuth } from "../../middlewares/isAuthenticated";

const router = Router();

const routes = {
  base: "/url",
  root: "/",
};

/// Login route

const urlBaseRoute = routes.base;

router.post(
  routes.root,
  isAuth,
  validator(createURLSchema),
  createURLController
);

export { router as urlRouter, urlBaseRoute };
