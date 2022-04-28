import { sign, verify } from "jsonwebtoken";
import config from "../../config";
const generateUserToken = (data: any) => {
  const token = sign(data, config.appTokenSecret as string, {
    expiresIn: config.appTokenExpiry,
  });

  return token;
};

const verifyUserToken = (token: string) =>
  verify(token, config.appTokenSecret as string);

export { generateUserToken, verifyUserToken };
