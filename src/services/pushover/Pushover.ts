import axios from "axios";
import config from "../../config";

interface IPushOverMessage {
  user: string;
  token?: string;
  message: string;
  title: string;
  send?: () => Promise<{ success: boolean }>;
  url?: string;
  url_title?: string;
  html?: boolean;
}
export class PushOverMessage {
  public user = config.pushOverUser;
  public token = config.pushOverToken;
  public subScribtionLink = `${config.pushOverSubscribeLink}${config.appDomain}/callback/pushover`;

  constructor() {}

  async send(messageData: IPushOverMessage) {
    try {
      await axios.post("https://api.pushover.net/1/messages.json", {
        ...messageData,
        token: this.token,
      });

      return {
        success: true,
      };
    } catch (error) {
      return { success: false };
    }
  }

  generateURL(userId?: number) {
    return `${this.subScribtionLink}?userId=${userId}`;
  }
}

let pushover = new PushOverMessage();

export { pushover };
