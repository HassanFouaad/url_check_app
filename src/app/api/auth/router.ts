import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import { loginSchema, registerSchema, emailVerificationSchema } from "./schema";

import {
  loginController,
  registerController,
  emailVerificationController,
} from "./controllers";

const router = Router();

const routes = {
  base: "/auth",
  root: "/",
  login: "/login",
  register: "/register",
  verifyEmail: "/email-verification",
};

//Register
router.post(
  routes.register,
  validator(registerSchema),
  controller(registerController)
);

/// Login route
router.post(routes.login, validator(loginSchema), controller(loginController));

// Email verification
router.put(
  routes.verifyEmail,
  validator(emailVerificationSchema),
  controller(emailVerificationController)
);

const authBaseRoute = routes.base;

export { router as authRouter, authBaseRoute };
