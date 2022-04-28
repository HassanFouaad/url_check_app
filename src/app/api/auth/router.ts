import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import { loginSchema } from "./schema";

import { loginController } from "./controllers";

const router = Router();

const routes = {
  base: "/auth",
  root: "/",
  login: "/login",
};

/// Login route
router.post(routes.login, validator(loginSchema), controller(loginController));

const authBaseRoute = routes.base;

export { router as authRouter, authBaseRoute };
