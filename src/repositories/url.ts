import { IURL } from "../interfaces/url";
import { IURLHistory } from "../interfaces/urlHistory";
import { URL, User, URLHistory } from "../models";
import { queueTasks } from "../tasks/TaskManager";

export class URLHistoryRepository {
  private urlHistoryModel: typeof URLHistory;
  constructor(urlModel: typeof URLHistory) {
    this.urlHistoryModel = urlModel;
  }

  public async create(urlHistory: IURLHistory) {
    let createdURLHistory = await this.urlHistoryModel.create(urlHistory);
    return createdURLHistory;
  }

  public async countByQuery(query: any): Promise<any> {
    let count = await this.urlHistoryModel.count(query);
    return count;
  }

  public async findOneByQuery(query: any): Promise<IURLHistory> {
    let url = await this.urlHistoryModel.findOne(query);
    return url;
  }
  public async findAndCountAllByQuery(query: any) {
    return await this.urlHistoryModel.findAndCountAll(query);
  }
}

export class URLRepository {
  private urlModel: typeof URL;
  constructor(urlModel: typeof URL) {
    this.urlModel = urlModel;
  }

  public async createNewURL(url: IURL) {
    let createdURL = await this.urlModel.create(url);
    if (createdURL?.id) {
      await queueTasks.create(createdURL.id, createdURL.interval);
    }

    return createdURL;
  }

  public async findURLById(id: number, additionalWhereQuery: any = {}) {
    let found = await this.urlModel.findOne({
      attributes: { exclude: ["deletedAt"] },
      where: { id, ...additionalWhereQuery },
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["password", "deletedAt"] },
        },
        {
          model: URLHistory,
          as: "urlHistories",
          required: false,
          limit: 1,
          order: [["id", "desc"]],
        },
      ],
    });

    return found;
  }

  public async updateURL(updatedData: any, where: any) {
    return await this.urlModel.update(updatedData, { where });
  }

  public async deleteURL(id: number, interval: number) {
    await queueTasks.delete(id, interval);
    await this.urlModel.update({ deletedAt: new Date() }, { where: { id } });
  }

  public async findAndCountAllByQuery(query: any) {
    return await this.urlModel.findAndCountAll(query);
  }
  public async findOneByQuery(query: any) {
    return await this.urlModel.findOne(query);
  }
}
