import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import {
  createURLSchema,
  deleteURLSchema,
  readURLSchema,
  updateURLSchema,
} from "./schema";

import {
  createURLController,
  deleteURLController,
  readURLController,
  updateURLController,
  urlChecksReportController,
} from "./controllers";
import { isAuth } from "../../middlewares/isAuthenticated";

const router = Router();

const routes = {
  base: "/url",
  root: "/",
  report: "/report",
};

const urlBaseRoute = routes.base;

router.post(
  routes.root,
  isAuth,
  validator(createURLSchema),
  controller(createURLController)
);

router.get(
  routes.root,
  isAuth,
  validator(readURLSchema),
  controller(readURLController)
);

router.delete(
  routes.root,
  isAuth,
  validator(deleteURLSchema),
  controller(deleteURLController)
);

router.put(
  routes.root,
  isAuth,
  validator(updateURLSchema),
  controller(updateURLController)
);

router.post(routes.report, isAuth, controller(urlChecksReportController));

export { router as urlRouter, urlBaseRoute };
