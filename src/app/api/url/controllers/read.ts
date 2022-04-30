import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { urlRepo } from "../../../../repositories";

export const readURLController = async ({
  query,
  user,
}: IAuthenticatedRequest) => {
  let { urlId } = query;

  let id = parseInt(String(urlId));

  let url = await urlRepo.findURLById(id, { userId: user.id });

  if (!url?.id) return { error: "Invalid url id", status: 400 };

  return {
    message: "Successfull read request",
    data: url,
  };
};
