import { compare } from "bcrypt";
import { Request } from "express";

import { userRepo } from "../../../../repositories";
import { generateUserToken } from "../../../utils/jwt";

async function loginController(req: Request) {
  const { email, password } = req.body;

  /// Finding if the account exists
  const user = await userRepo.findUserByEmail(email);
  if (!user) return { error: "Invalid email or password", status: 401 };

  /// Password validating
  let validPassword = await compare(password, user.password);
  if (!validPassword)
    return { error: "Invalid email or password", status: 401 };

  // Generating new user token
  const token = generateUserToken({
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
  });

  /// Returns the data to the client
  return {
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        pushoverkey: user.pushoverKey,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    message: "Welcome back",
  };
}

export { loginController };
