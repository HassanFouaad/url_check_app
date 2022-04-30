import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "../connection/database";

import { IEmailVerification } from "../interfaces/emailVerification";

interface EmailVerificationCreationAttributes
  extends Optional<IEmailVerification, "id"> {}

interface EmailVerificationInstance
  extends Model<IEmailVerification, EmailVerificationCreationAttributes>,
    IEmailVerification {}

const EmailVerification = sequelize.define<EmailVerificationInstance>(
  "EmailVerification",
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
    vCode: {
      type: DataTypes.STRING,
    },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
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
    tableName: "emailVerification",
    defaultScope: {
      where: { deletedAt: null },
    },
  }
);

export default EmailVerification;
