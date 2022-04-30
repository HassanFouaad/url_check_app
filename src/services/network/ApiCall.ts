import axios from "axios";
import https from "https";
let axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  function (config: any) {
    if (config) {
      config.metadata = { startTime: new Date() };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response: any) {
    if (response?.config) {
      response.config.metadata.endTime = new Date();
      let duration =
        response.config.metadata.endTime - response.config.metadata.startTime;
      response.duration = duration;
      response.config.metadata.duration = duration;
    }
    return response;
  },
  function (error) {
    if (error?.config) {
      error.config.metadata.endTime = new Date();
      let duration =
        error.config.metadata.endTime - error.config.metadata.startTime;

      error.duration = duration;
      error.config.metadata.duration = duration;
    }
    return Promise.reject(error);
  }
);

export const makeApiGetRequest = async ({
  endPoint,
  timeout,
  headers,
  ignoreSSL = false,
  authentication,
}: {
  endPoint: string;
  headers: any;
  timeout: number;
  ignoreSSL: boolean;
  authentication?: {
    username: string;
    password: string;
  };
}) => {
  try {
    axiosInstance.defaults.timeout = timeout;

    let httpsAgent: any;

    if (!ignoreSSL) {
      httpsAgent = new https.Agent({
        rejectUnauthorized: true,
      });
    }

    let response: any = await axiosInstance.get(endPoint, {
      httpAgent: httpsAgent,
      auth: authentication,
      headers: {
        ...headers,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    let responseStatus = response?.status;
    let responseDuration = response?.config?.metadata?.duration;

    return {
      responseDuration,
      responseStatus,
      timedOut: false,
    };
  } catch (error: any) {
    let errResponse = error?.response;
    let metaData = error?.config?.metadata;
    let responseDuration = metaData?.duration;
    let timedOut = String(error?.message).includes("timeout of");
    let responseStatus = errResponse?.status;

    return { timedOut, responseStatus, responseDuration };
  }
};

export const makeApiPostRequest = async (endPoint: string, body: any) => {
  try {
    await axios.post(endPoint, body);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
