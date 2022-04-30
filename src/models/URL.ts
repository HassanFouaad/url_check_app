import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../connection/database";

import { IURL } from "../interfaces/url";

interface URLCreationAttributes extends Optional<IURL, "id"> {}

interface URLCheckInstance extends Model<IURL, URLCreationAttributes>, IURL {}

const URL = sequelize.define<URLCheckInstance>(
  "URL",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: "user",
        },
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    webhook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5 * 1000,
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10 * 1000 * 60,
    },
    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    authentication: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    httpHeaders: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    assert: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    ignoreSSL: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "url",
    defaultScope: {
      where: { deletedAt: null },
    },
  }
);

export default URL;
