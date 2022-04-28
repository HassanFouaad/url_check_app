import { createServer } from "http";
import { app } from "./app";
import config from "./config";
import { connectToSQLDatabase } from "./connection/database";
import defaultLogger from "./core/logger";

const port = config.port;
const httpServer = createServer(app);

const startServer = async () => {
  await connectToSQLDatabase();
  httpServer.listen(port, () => {
    defaultLogger.info(`Nodejs Application is up and running on port ${port}`);
  });
};

startServer();
