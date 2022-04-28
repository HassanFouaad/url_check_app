import { Router } from "express";

import { authRouter, authBaseRoute } from "./auth/router";
import { urlRouter, urlBaseRoute } from "./url/router";

const baseRouter = Router();

baseRouter.use(authBaseRoute, authRouter);
baseRouter.use(urlBaseRoute, urlRouter);

export { baseRouter as apiBaseRouter };
