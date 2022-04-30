import logger from "../core/logger";
import { Options } from "sequelize";
import config from ".";

let dbLogger = (d: string) => {
  logger.info(d);
};

const sequelizeOptions: Options = {
  password: config.dbPassword,
  username: config.dbUsername,
  port: parseInt(config.dbPort),
  host: config.dbHost,
  database: config.dbName,
  protocol: "tcp",
  native: false,
  ssl: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 20000,
  },
  dialect: "postgres",
  logging: process.env.NODE_ENV === "production" ? false : false,
  define: {
    underscored: false,
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    deletedAt: "deletedAt",
  },
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
};
export { sequelizeOptions as development, sequelizeOptions as production };
