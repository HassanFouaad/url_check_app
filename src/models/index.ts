import { sequelize } from "../connection/database";
import User from "./User";
import URL from "./URL";
import EmailVerification from "./EmailVerification";
import URLHistory from "./URLHistory";

URL.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(EmailVerification, {
  as: "emailVerification",
  foreignKey: "userId",
});

URL.hasMany(URLHistory, {
  foreignKey: "urlId",
  as: "urlHistories",
});
export { sequelize, User, URL, EmailVerification, URLHistory };
