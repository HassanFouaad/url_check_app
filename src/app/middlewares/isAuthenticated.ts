import { Request, Response, NextFunction } from "express";
import { IUser } from "../../interfaces/user";
import { userRepo } from "../../repositories";
import { verifyUserToken } from "../utils/jwt";

export interface IUserRequest extends Request {
  user: IUser;
}

const isAuth: any = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  /// Getting token from request headers
  const token = req.get("authorization");

  //Checking if token exists
  if (!token) {
    return res.status(403).json({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  }

  try {
    //Verifying jwt token
    const payload: any = verifyUserToken(token);
    if (!payload.emailVerified)
      return res.status(403).json({
        error: {
          message: "Please verify your email first",
          status: 403,
        },
      });
    // Adding token payload to request pay load
    req.user = payload;

    /// CHecking if user exists
    let user = await userRepo.findUserById(payload.id);

    if (!user) {
      return res.status(404).json({
        error: {
          message: "Your account has been deleted",
          status: 404,
        },
      });
    }
    // Contrinue the middleware flow
    next();
  } catch (error: any) {
    // Error while veryfing the auth token
    // Returning access denied to the user
    return res
      .json({
        error,
      })
      .status(403);
  }
};

export { isAuth };
