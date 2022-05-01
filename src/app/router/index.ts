import { Router } from "express";

import { apiBaseRouter } from "../api/router";
import { callbackBaseRouter } from "../callback/router";
const router = Router();

router.use("/api", apiBaseRouter);
router.use("/callback", callbackBaseRouter);

export { router as MainRouter };
