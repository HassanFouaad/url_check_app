import { User } from "../models";

export class UserRepository {
  private userModel: typeof User;
  constructor(userModel: typeof User) {
    this.userModel = userModel;
  }

  async findByUsername(username: string) {
    let user = await this.userModel.findOne({ where: { username } });
    return user;
  }

  async findUserById(id: number) {
    let user = await this.userModel.findOne({ where: { id } });
    return user;
  }
}
