import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../connection/database";

import { IUser } from "../interfaces/user";

interface UserCreationAttributes extends Optional<IUser, "id"> {}

interface UserInstance extends Model<IUser, UserCreationAttributes>, IUser {}

const User = sequelize.define<UserInstance>(
  "User",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: { type: DataTypes.STRING, allowNull: false },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pushoverKey: { type: DataTypes.STRING },
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
    tableName: "user",
    defaultScope: {
      where: { deletedAt: null },
    },
  }
);

export default User;
