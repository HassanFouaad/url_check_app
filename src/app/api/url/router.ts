import { Router } from "express";
import { controller } from "../../middlewares/controller";
import { validator } from "../../middlewares/validator";

import {
  createURLSchema,
  deleteURLSchema,
  readURLSchema,
  updateURLSchema,
  urlChecksReportListSchema,
  urlSingleURLReportWithLogsSchema,
} from "./schema";

import {
  createURLController,
  deleteURLController,
  readURLController,
  readSingleCOntroller,
  updateURLController,
  urlChecksReportListController,
  urlSingleURLReportWithLogsController,
} from "./controllers";
import { isAuth } from "../../middlewares/isAuthenticated";

const router = Router();

const routes = {
  base: "/url",
  root: "/",
  single: "/:urlId",
  reportList: "/report",
  singleReportWithLogs: "/report/:urlId",
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

router.get(
  routes.single,
  isAuth,
  validator({} as any),
  controller(readSingleCOntroller)
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

router.post(
  routes.reportList,
  isAuth,
  validator(urlChecksReportListSchema),
  controller(urlChecksReportListController)
);

router.post(
  routes.singleReportWithLogs,
  isAuth,
  validator(urlSingleURLReportWithLogsSchema),
  controller(urlSingleURLReportWithLogsController)
);

export { router as urlRouter, urlBaseRoute };
