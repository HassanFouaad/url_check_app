import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { urlRepo } from "../../../../repositories";

export const createURLController = async (req: IAuthenticatedRequest) => {
  let {
    name,
    url,
    protocol,
    path,
    port,
    webhook,
    timeout,
    interval,
    threshold,
    authentication,
    httpHeaders,
    assert,
    tags,
    ignoreSSL,
  } = req.body;

  /// Parsing the data
  const { id: userId } = req.user;

  let parsedURL = String(url).replace("http://", "").replace("https://", "");

  if (parsedURL.endsWith("/")) {
    parsedURL = parsedURL.slice(0, -1);
  }

  /// Creating the new url in the database
  let newURL = await urlRepo.createNewURL({
    userId,
    name,
    url: parsedURL,
    protocol,
    path,
    port,
    webhook,
    timeout,
    interval,
    threshold,
    authentication,
    httpHeaders,
    assert,
    tags,
    ignoreSSL,
  });

  /// Returns the result to the client
  return {
    data: newURL,
    message: "Success",
  };
};
