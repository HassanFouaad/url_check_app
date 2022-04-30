export interface IURLHistory {
  id?: number;
  urlId: number;
  responseTime: number;
  passedAssert?: boolean;
  statusCode: number | null;
  userNotified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
