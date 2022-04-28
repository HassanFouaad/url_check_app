import { Router } from "express";

import { apiBaseRouter } from "../api/router";
const router = Router();

router.use("/api", apiBaseRouter);
export { router as MainRouter };
