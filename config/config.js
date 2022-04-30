require("dotenv").config();
const sequelizeOptions = {
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
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
module.exports = {
  development: {
    ...sequelizeOptions,
  },
};
