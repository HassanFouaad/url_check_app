import { Router } from "express";

import { pushoverRouter, pushoverBaseRoute } from "./pushover/router";

const baseRouter = Router();

baseRouter.use(pushoverBaseRoute, pushoverRouter);

export { baseRouter as callbackBaseRouter };
