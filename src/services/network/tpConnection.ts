import net from "net";

async function checkConnection(host: string, port: number, timeout: number) {
  return await new Promise(function (resolve, reject) {
    timeout = timeout || 5000; // default of 5 seconds
    var timer = setTimeout(function () {
      reject("timeout");
      socket.end();
    }, timeout);
    var socket = net.createConnection(port, host, function () {
      clearTimeout(timer);

      resolve({ success: true });
      socket.end();
    });
    socket.on("error", function (err) {
      clearTimeout(timer);
      reject({ err });
    });
  });
}
export const testTcpConnection = async ({
  endPoint,
  timeout,
  port,
}: {
  endPoint: string;
  timeout: number;
  port: number;
  path?: string;
}) => {
  let startTime: any = new Date();
  try {
    await checkConnection(endPoint, port, timeout);
    let endTime: any = new Date();
    let responseDuration = endTime - startTime;

    return {
      success: true,
      responseDuration,
    };
  } catch (error) {
    let endTime: any = new Date();
    let responseDuration = endTime - startTime;

    return {
      success: false,
      responseDuration,
    };
  }
};
