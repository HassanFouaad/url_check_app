import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import { pushoverCallbackSchema } from "./schema";

import { pushoverCallbackController } from "./controllers";

const router = Router();

const routes = {
  base: "/pushover",
  root: "/",
};

router.get(
  routes.root,
  validator(pushoverCallbackSchema),
  controller(pushoverCallbackController)
);

let pushoverBaseRoute = routes.base;
export { router as pushoverRouter, pushoverBaseRoute };
