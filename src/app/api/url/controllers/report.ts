import { Op } from "sequelize";
import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { sequelize, URLHistory } from "../../../../models";
import { urlRepo } from "../../../../repositories";
import Pagination from "../../../utils/pagination";

interface Report {
  currentStatus: string;
  availability: number;
  lastLogs: any;
}
export const reportGenerator = (urlList: any) => {
  let responseReport: Report[] = urlList.map((rawURL: any) => {
    /// JSONFY the model response
    if (rawURL.toJSON()) {
      rawURL = rawURL.toJSON();
    }

    /// Defining the helper variables
    let lastLogs = rawURL?.urlHistories;
    let lastLogStatusCode = lastLogs[0]?.statusCode;
    let interval = rawURL.interval;
    let totalUpCount = rawURL.upCount;
    let outages = rawURL.downCount;
    let totalChecksCount = rawURL.totalCount;

    // If the last history log statuscode is found return and not server error set it as up and running url
    let currentStatus = (!lastLogStatusCode || lastLogStatusCode > 499 )  ? "DOWN" : "UP";




    let availability = ((totalUpCount / totalChecksCount) * 100).toFixed(2);

    let uptime = (interval * totalUpCount) / 1000;
    let downTime = (interval * outages) / 1000;

    return { currentStatus, availability, outages, uptime, downTime, lastLogs };
  });

  return responseReport;
};

export const urlChecksReportController = async ({
  body,
  user,
}: IAuthenticatedRequest) => {
  let userId = user?.id;
  let { page, limit, tags }: any = body;

  let paginate = new Pagination(page, limit);

  let offset = paginate.getOffset();
  let queryLimit = paginate.getLimit();

  let dbQuery = {
    where: {
      userId,
      ...(tags?.length
        ? {
            tags: { [Op.contains]: tags },
          }
        : {}),
    },
    offset,
    limit: queryLimit,
    order: [["id", "desc"]],
    attributes: [
      "id",
      "interval",
      [
        sequelize.literal(
          `
    (
        select count (id)
        from "urlHistory"
        where "urlId" = "URL"."id"
    )
    `
        ),
        "totalCount",
      ],
      [
        sequelize.literal(
          `
    (
        select count (id)
        from "urlHistory"
        where "urlHistory"."urlId" = "URL"."id" and ("urlHistory"."statusCode" is NULL or "urlHistory"."statusCode" > 499) 
    )
    `
        ),
        "downCount",
      ],
      [
        sequelize.literal(
          `
    (
        select count (id)
        from "urlHistory"
        where "urlHistory"."urlId" = "URL"."id" and "urlHistory"."statusCode" is not NULL and "urlHistory"."statusCode" < 499
    )
    `
        ),
        "upCount",
      ],
    ],
    include: [
      {
        model: URLHistory,
        as: "urlHistories",
        required: false,
        limit: 10,
        order: [["id", "desc"]],
        attributes: ["responseTime", "statusCode", "passedAssert", "createdAt"],
      },
    ],
  };

  let { count, rows } = await urlRepo.findAndCountAllByQuery(dbQuery);

  return {
    message: "Successfull read request",
    data: reportGenerator(rows),
    meta: paginate.getMetaData(count),
  };
};
