import { User, URL, URLHistory } from "../models";
import { URLHistoryRepository, URLRepository } from "./url";
import { UserRepository } from "./user";

let userRepo = new UserRepository(User);
let urlHistoryRepo = new URLHistoryRepository(URLHistory);
let urlRepo = new URLRepository(URL);

export { userRepo, urlHistoryRepo, urlRepo };
