import { Op } from "sequelize";
import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { IURLHistory } from "../../../../interfaces/urlHistory";
import { sequelize, URLHistory } from "../../../../models";
import { urlHistoryRepo, urlRepo } from "../../../../repositories";
import Pagination from "../../../utils/pagination";

interface Report {
  currentStatus: string;
  availability: number;
  lastLogs: any;
}

interface FormattedLog extends IURLHistory {
  status: string;
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
    let currentStatus =
      !lastLogStatusCode || lastLogStatusCode > 499 ? "DOWN" : "UP";

    let availability = ((totalUpCount / totalChecksCount) * 100).toFixed(2);

    let uptime = (interval * totalUpCount) / 1000;
    let downTime = (interval * outages) / 1000;

    return {
      currentStatus,
      availability,
      outages,
      uptime,
      downTime,
      logs: formatLogs(lastLogs, rawURL.assert ? true : false),
    };
  });

  return responseReport;
};

export const formatLogs = (
  logs: IURLHistory[],
  assert: boolean
): FormattedLog[] => {
  let newLogs: FormattedLog[] = logs.map((log: any) => {
    if (log.toJSON) {
      log = log.toJSON();
    }

    let status = !log.statusCode || log.statusCode > 499 ? "DOWN" : "UP";
    let formattedLog = { ...log, status };

    if (!assert) {
      delete formattedLog.passedAssert;
    }

    return formattedLog;
  });

  return newLogs;
};

export const urlChecksReportListController = async ({
  body,
  user,
}: IAuthenticatedRequest) => {
  let userId = user?.id;
  let { page, limit, tags }: any = body;

  let paginate = new Pagination(page, limit);

  let offset = paginate.getOffset();

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
    limit: paginate.getLimit(),
    order: [["id", "desc"]],
    attributes: [
      "id",
      "interval",
      "assert",
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

export const urlSingleURLReportWithLogsController = async ({
  user,
  body,
  params,
}: IAuthenticatedRequest) => {
  try {
    let userId = user?.id;
    let { page, limit }: any = body;
    let { urlId }: any = params;

    urlId = parseInt(urlId);

    if (isNaN(urlId)) {
      return {
        error: "Invalid url id",
        status: 400,
      };
    }

    let reprotQuery = {
      where: {
        userId,
        id: urlId,
      },
      attributes: [
        "id",
        "interval",
        "assert",
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
          limit: 1,
          order: [["id", "desc"]],
          attributes: [
            "responseTime",
            "statusCode",
            "passedAssert",
            "createdAt",
          ],
        },
      ],
    };

    let url = await urlRepo.findOneByQuery(reprotQuery);
    if (!url) return { error: "URL is not found", status: 400 };

    let urlReport = reportGenerator([url])[0];

    let paginate = new Pagination(page, limit);
    let offset = paginate.getOffset();

    let logsQuery = {
      offset,
      limit: paginate.getLimit(),
      where: {
        urlId,
      },
      order: [["id", "desc"]],
      attributes: ["responseTime", "statusCode", "passedAssert", "createdAt"],
    };

    let { count, rows: logs } = await urlHistoryRepo.findAndCountAllByQuery(
      logsQuery
    );

    return {
      message: "Successfull read request",
      data: {
        urlReport,
        logs: formatLogs(logs, url.getDataValue("assert") ? true : false),
      },
      meta: paginate.getMetaData(count),
    };
  } catch (error) {
    return {
      error: "Server Error",
      status: 500,
    };
  }
};
