import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import errorHandler from "./middlewares/errorHandler";
import { MainRouter } from "./router";

// Apply the rate limiting middleware to all requests

// App Defination
const app: Application = express();

///Main Middlewares
app.use(helmet());
app.disable("powered-by");
app.use(cors());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(morgan("dev"));

//ROutes
app.get("/", (req: Request, res: Response) => res.send(new Date()));

app.use("/", MainRouter);
app.use(errorHandler);

app.use("*", (req: Request, res: Response) =>
  res
    .json({
      error: "API NOT FOUND",
      status: 404,
    })
    .status(404)
);
export { app };
