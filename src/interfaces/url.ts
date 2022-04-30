import { IURLHistory } from "./urlHistory";
import { IUser } from "./user";

export interface IURL {
  id?: number;
  userId: number;
  name: string;
  url: string;
  protocol: "tcp" | "http" | "https";
  path: string;
  port: number;
  webhook: string;

  timeout: number;

  interval: number;

  threshold: number;

  authentication: {
    username: string;
    password: string;
  };

  httpHeaders: {
    key: string;
    value: string;
  }[];

  assert: {
    statusCode: number;
  };

  tags: string[];

  ignoreSSL: boolean;
  urlHistories?: IURLHistory[];
  user?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
