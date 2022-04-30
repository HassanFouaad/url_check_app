import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../connection/database";

import { IURLHistory } from "../interfaces/urlHistory";

interface URLHistoryCreationAttributes extends Optional<IURLHistory, "id"> {}

interface URLHistoryInstance
  extends Model<IURLHistory, URLHistoryCreationAttributes>,
    IURLHistory {}

const URLHistory = sequelize.define<URLHistoryInstance>(
  "URLHistory",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    urlId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: "url",
        },
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    responseTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    passedAssert: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
    userNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "urlHistory",
    defaultScope: {
      where: { deletedAt: null },
    },
  }
);

export default URLHistory;
