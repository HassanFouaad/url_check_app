import { config as configEnv } from "dotenv";
configEnv();

export interface IConfig {
  port: number;
  dbPassword: string;
  dbUsername: string;
  dbPort: string;
  dbHost: string;
  dbName: string;

  appTokenSecret: string;
  appTokenExpiry: string;
}

const config = {
  port: parseInt(process.env.PORT as string),
  dbPassword: process.env.DB_PASSWORD as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPort: process.env.DB_PORT as string,
  dbHost: process.env.DB_HOST as string,
  dbName: process.env.DB_DATABASE as string,
  appTokenSecret: process.env.APP_TOKEN_SECRET,
  appTokenExpiry: process.env.APP_TOKEN_EXPIRY,
};
export default config;
