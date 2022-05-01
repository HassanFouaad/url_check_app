import { IEmailVerification } from "./emailVerification";

export interface IUser {
  id?: number;
  password: string;
  username: string;
  email: string;
  emailVerified: boolean;
  emailVerification?: IEmailVerification[];
  pushoverKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
