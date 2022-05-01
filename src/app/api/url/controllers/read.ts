import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { urlRepo } from "../../../../repositories";
import Pagination from "../../../utils/pagination";
import { Op } from "sequelize";
import { isNaN } from "lodash";
export const readURLController = async ({
  query,
  user,
}: IAuthenticatedRequest) => {
  let { tags, limit, page }: any = query;

  let paginate = new Pagination(page, limit);

  let offset = paginate.getOffset();
  let queryLimit = paginate.getLimit();

  const dbQuery = {
    where: {
      userId: user.id,
      ...(tags?.length
        ? {
            tags: { [Op.contains]: tags },
          }
        : {}),
    },
    offset,
    limit: queryLimit,
    order: [["id", "desc"]],
  };

  let { count, rows } = await urlRepo.findAndCountAllByQuery(dbQuery);

  return {
    message: "Successfull read request",
    data: rows,
    meta: paginate.getMetaData(count),
  };
};

export const readSingleCOntroller = async ({
  params,
  user,
}: IAuthenticatedRequest) => {
  let { urlId }: any = params;
  urlId = parseInt(urlId);

  if (isNaN(urlId)) {
    return {
      error: "Invalid url id",
      status: 400,
    };
  }

  let url = await urlRepo.findURLById(urlId, { userId: user.id });

  if (!url) return { error: "url is not found", status: 404 };

  return {
    message: "Successfull read request",
    data: url,
  };
};
