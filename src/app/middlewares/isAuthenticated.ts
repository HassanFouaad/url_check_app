import { Request, Response, NextFunction } from "express";
import { IUser } from "../../interfaces/user";
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

    // Adding token payload to request pay load
    req.user = payload;

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
