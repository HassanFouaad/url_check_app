import { Sequelize } from "sequelize";
import { development } from "../config/sequelize";
import defaultLogger from "../core/logger";
const sequelize = new Sequelize(development);

const connectToSQLDatabase = async () => {
  try {
    await sequelize.authenticate();
    defaultLogger.info(`MYSQL DB has been connected!`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { connectToSQLDatabase, sequelize };
