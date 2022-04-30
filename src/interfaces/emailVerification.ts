export interface IEmailVerification {
  id: number;
  userId: number;
  vCode: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
