export interface IURLHistory {
  id: number;
  urlId: number;
  responseTime: number;
  passedAssert: boolean;
  statusCode: number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
