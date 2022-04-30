import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { urlRepo } from "../../../../repositories";

export const deleteURLController = async ({
  query,
  user,
}: IAuthenticatedRequest) => {
  let { urlId } = query;

  let id = parseInt(String(urlId));

  const url = await urlRepo.findURLById(id, { userId: user.id });

  if (!url?.id) return { error: "url is not found", status: 404 };

  await urlRepo.deleteURL(url.id, url.interval);

  return {
    message: "URL has been deleted",
    data: url,
  };
};
