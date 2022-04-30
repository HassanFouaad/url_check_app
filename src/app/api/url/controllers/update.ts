import { IAuthenticatedRequest } from "../../../../interfaces/authUserReq";
import { urlRepo } from "../../../../repositories";
import { queueTasks } from "../../../../tasks/TaskManager";

export const updateURLController = async (req: IAuthenticatedRequest) => {
  let {
    urlId,
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

  const { id: userId } = req.user;
  let id = parseInt(String(urlId));

  /// Finding the url
  let urlFound = await urlRepo.findURLById(id, { userId });

  // Checking if exists
  if (!urlFound?.id) return { error: "Invalid url id", status: 400 };

  // Parsing the new url
  let parsedURL = urlFound.url;
  if (url) {
    parsedURL = String(url).replace("http://", "").replace("https://", "");
    if (parsedURL.endsWith("/")) {
      parsedURL = parsedURL.slice(0, -1);
    }
  }
  if (interval) {
    queueTasks.update(id, interval, urlFound.interval);
  }
  /// Updating the data base
  await urlFound.update({
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

  /// Update task queue if new interval

  /// Returning the updated data to the client
  return {
    data: urlFound.toJSON(),
    message: "URL has been updated",
  };
};
