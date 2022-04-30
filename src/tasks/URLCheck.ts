import { Op } from "sequelize";
import defaultLogger from "../core/logger";
import { IURL } from "../interfaces/url";
import { urlHistoryRepo } from "../repositories";
import { urlRepo } from "../repositories";
import { makeApiGetRequest } from "../services/network/ApiCall";
import { testTcpConnection } from "../services/network/tpConnection";
import { Notification } from "../services/notification/Notify";

export class URLChecker {
  public id: number;
  public passedAssert: boolean;
  public responseTime: number | undefined;
  public statusCode: number | undefined;
  public url?: IURL;

  constructor(id: number) {
    this.id = id;
    this.passedAssert = false;
  }

  async httpCall() {
    if (!this.url) return { success: false };
    let {
      protocol,
      url: urlString,
      port,
      path,
      httpHeaders,
      ignoreSSL,
      authentication,
      timeout,
    } = this.url;

    let requestHeaders = this.buildHeaders(httpHeaders);
    let endPoint = this.buildEndPoint(urlString, port, protocol, path);

    const { responseDuration, responseStatus } = await makeApiGetRequest({
      endPoint,
      headers: requestHeaders,
      timeout,
      ignoreSSL,
      authentication,
    });

    return {
      success: responseStatus !== undefined || responseStatus >= 500,
      responseDuration,
      responseStatus,
    };
  }

  async tcpCall() {
    if (!this.url) return { success: false };

    let { url: urlString, port, path, timeout } = this.url;

    const { responseDuration, success } = await testTcpConnection({
      endPoint: urlString,
      timeout,
      port,
      path,
    });

    return {
      success: success ? true : false,
      responseStatus: success ? 200 : null,
      responseDuration,
    };
  }

  async start() {
    let urlFound = await urlRepo.findURLById(this.id);

    if (!urlFound) return defaultLogger.error("URL NOT FOUND");

    this.url = urlFound.toJSON();

    let { protocol, assert } = this.url;

    const { success, responseDuration, responseStatus } =
      protocol === "tcp" ? await this.tcpCall() : await this.httpCall();

    let passedAssert = assert?.statusCode
      ? assert?.statusCode === responseStatus
      : undefined;

    this.responseTime = responseDuration;
    this.statusCode = responseStatus;

    let shouldNotifyTheUser = await this.shouldNotifyTheUser(success);

    await urlHistoryRepo.create({
      responseTime: responseDuration,
      statusCode: responseStatus,
      passedAssert,
      urlId: this.id,
      userNotified: shouldNotifyTheUser,
    });

    if (shouldNotifyTheUser) {
      this.notifyUser({ currentStatus: success });
    }
  }

  buildEndPoint = (
    urlString: string,
    port?: number,
    protocol?: string,
    path?: string
  ) => {
    if (port) {
      urlString = urlString + ":" + port;
    }

    let endPoint = protocol + "://" + urlString + "/";

    if (path) {
      endPoint = endPoint + path;
    }

    return endPoint;
  };

  buildHeaders(headers: any) {
    let requestHeaders: any = {};
    if (headers?.length) {
      headers.map((header: any) => (requestHeaders[header.key] = header.value));
    }

    return requestHeaders;
  }

  async shouldNotifyTheUser(success: boolean) {
    let hasHistory = this.url?.urlHistories && this.url?.urlHistories[0];
    let wasUpLastTime = hasHistory?.statusCode ? true : false;
    let threshold = this.url?.threshold;

    if (success) {
      if (!wasUpLastTime) return true;
      else return false;
    } else {
      if (!hasHistory) {
        return true;
      }

      let lastTimeWasUp = await urlHistoryRepo.findOneByQuery({
        where: {
          statusCode: { [Op.ne]: null },
          urlId: this.id,
        },
        raw: true,
        attributes: ["id"],
        order: [["id", "desc"]],
      });

      if (!lastTimeWasUp) {
        return false;
      }

      let lastDownIntervals = await urlHistoryRepo.countByQuery({
        where: {
          id: { [Op.gte]: lastTimeWasUp?.id },
          urlId: this.id,
        },
      });

      if (lastDownIntervals == threshold) {
        return true;
      }

      return false;
    }
  }

  async notifyUser({ currentStatus }: { currentStatus: boolean }) {
    let user = this.url?.user;
    if (user && this.url) {
      let notification = new Notification({
        user,
        urlStatus: currentStatus ? "up" : "down",
        url: this.url,
      });

      notification.notify();
    }
  }
}
