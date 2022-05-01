import { Request } from "express";
import { userRepo } from "../../../repositories";
export const pushoverCallbackController = async ({ query }: Request) => {
  const { userId, pushover_user_key }: any = query;

  const user = await userRepo.findUserById(userId);

  if (!user) return { error: "Invalid user id", status: 400 };

  await user.update({ pushoverKey: pushover_user_key });

  return {
    message: "Thank you for subscribing to bosta-app-task in pushover, you will receive notification through it",
  };
};
