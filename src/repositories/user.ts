import { IUser } from "../interfaces/user";
import { User } from "../models";

export class UserRepository {
  private userModel: typeof User;
  constructor(userModel: typeof User) {
    this.userModel = userModel;
  }

  async createNewUser(user: IUser) {
    return await this.userModel.create(user);
  }
  async findByUsername(username: string) {
    let user = await this.userModel.findOne({ where: { username } });
    return user;
  }

  async findUserById(id: number) {
    let user = await this.userModel.findOne({ where: { id } });
    return user;
  }
  async findUserByEmail(email: string) {
    let user = await this.userModel.findOne({ where: { email } });
    return user;
  }

  async findUserByQuery(query: any) {
    return await this.userModel.findOne(query);
  }

  async updateUser(updatedData: any, query: any) {
    await this.userModel.update(updatedData, query);
  }
}
