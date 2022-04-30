import { Request } from "express";

export interface IAuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}
