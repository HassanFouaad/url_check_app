import { compare } from "bcrypt";
import { Request } from "express";

import { userRepo } from "../../../../repositories";
import { generateUserToken } from "../../../utils/jwt";

async function loginController(req: Request) {
  const { username, password } = req.body;

  const user = await userRepo.findByUsername(username);

  if (!user) return { error: "Invalid username or password", status: 401 };

  let validPassword = await compare(password, user.password);

  if (!validPassword)
    return { error: "Invalid username or password", status: 401 };

  const token = generateUserToken({
    id: user.id,
    username: user.username,
  });

  return {
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
    message: "Welcome back",
  };
}

export { loginController };
