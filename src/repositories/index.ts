import { User } from "../models";
import { UserRepository } from "./user";

let userRepo = new UserRepository(User);

export { userRepo };
