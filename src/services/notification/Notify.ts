import { urlStatusEmailTemplate } from "../../constants/eTemplates";
import defaultLogger from "../../core/logger";
import { IURL } from "../../interfaces/url";
import { IUser } from "../../interfaces/user";
import { makeApiPostRequest } from "../network/ApiCall";
import { sendURLStatusEmail } from "../network/email";
import { pushover } from "../pushover/Pushover";

interface NotifyType {
  user: IUser;
  urlStatus: "up" | "down";
  url: IURL;
}

export class Notification implements NotifyType {
  user;
  urlStatus: "up" | "down";
  url;

  constructor({ user, urlStatus, url }: NotifyType) {
    this.user = user;
    this.urlStatus = urlStatus;
    this.url = url;
  }

  async notify() {
    try {
      defaultLogger.info(
        `Notifying the user with id ${this.user.id} about url status = ${this.urlStatus}`
      );

      /// Send email notification
      this.notifyByEmail();

      // Send webhook request notification if webhook exists
      if (this.url.webhook) this.notifyByWebhook();

      /// Pushover message
      if (this.user.pushoverKey) this.notifyByPushover();

      /// Other notification implementaions goes here
    } catch (error) {
      console.error("Error while notifying", error);
    }
  }

  async notifyByEmail() {
    const { email } = this.user;
    sendURLStatusEmail({ email, status: this.urlStatus, url: this.url.url });
  }

  async notifyByWebhook() {
    const { success } = await makeApiPostRequest(this.url.webhook, {
      status: this.urlStatus,
      url: this.url.url,
    });

    if (success)
      defaultLogger.info(
        `User ${this.user.id} received webook notification about url status = ${this.urlStatus}`
      );
    else
      defaultLogger.warn(
        `User ${this.user.id} didn't receive webook notification about url status = ${this.urlStatus}`
      );
  }

  async notifyByPushover() {
    if (!this.user?.pushoverKey) return;

    const { success } = await pushover.send({
      message: `${this.url.url} is ${this.urlStatus}`,
      title: `${this.url.url} current status`,
      user: this.user.pushoverKey,
    });

    if (success)
      defaultLogger.info(
        `User ${this.user.id} received pushover notification about url status = ${this.urlStatus}`
      );
    else
      defaultLogger.warn(
        `User ${this.user.id} didn't receive pushover notification about url status = ${this.urlStatus}`
      );
  }

  /// Other notification methods goes here
}
