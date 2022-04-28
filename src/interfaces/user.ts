export interface IUser {
  id: number;
  password: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
