import winston, { LoggerOptions } from "winston";
import fs from "fs";
import { config } from "dotenv";
config();
// create logs folder if it does not exist
const dir = "./logs";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let loggerConfig: LoggerOptions = {
  level: "info",
  exitOnError: false,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.timestamp()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      handleExceptions: false,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp()
      ),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp()
      ),
      handleExceptions: false,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp()
      ),
      handleExceptions: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "logs/exceptions.log",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp()
      ),
      handleExceptions: true,
    }),
  ],
};

const logger = winston.createLogger(loggerConfig);

let secondLogger = {
  info: (...any: any) => {},
  warn: (...any: any) => {},
  error: (...any: any) => {},
};

let defaultLogger = logger;

export default defaultLogger;
