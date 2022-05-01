import request from "supertest";
import faker from "@faker-js/faker";
import { app } from "../src/app";
import { sequelize } from "../src/connection/database";
import { generateUserToken } from "../src/app/utils/jwt";
import { queueTasks } from "../src/tasks/TaskManager";
import exp from "constants";
import { IURL } from "../src/interfaces/url";

let token: string;
let userId: number;
let newCreatedURLId: number;

let intervalMilliSeconds = 1000;

let urlData: any = {
  name: "Test URL",
  url: "15.237.56.33",
  path: "api",
  protocol: "tcp",
  ignoreSSL: true,
  interval: intervalMilliSeconds,
  timeout: 1000,
  threshold: 10,
  port: 7707,
  tags: ["bosta"],
};

let dataToBeUpdated: any = {
  name: "Test Updated URL",
  url: "hassan.fouad.com",
  path: "api",
  protocol: "http",
  ignoreSSL: true,
  interval: 2000,
  timeout: 2000,
  threshold: 10,
  port: 7700,
  httpHeaders: null,
  tags: null,
};

beforeAll(async () => {
  let email = faker.internet.email();
  let username = faker.internet.userName();
  let password = faker.random.alpha({ count: 10 });
  await sequelize.sync({ force: true }).catch(console.error);
  try {
    let userCreated = await sequelize.models.User.create({
      email,
      password,
      username,
      emailVerified: true,
    });
    const generatedToken = generateUserToken({
      id: userCreated.getDataValue("id"),
      email,
      password,
      username,
      emailVerified: true,
    });

    token = generatedToken;
    userId = userCreated.getDataValue("id");
  } catch (error) {
    console.error(error);
  }
});

describe("POST /api/url", () => {
  it("should return 200 && valid response if request body is valid and the user is authenticated and verified", async () => {
    const res = await request(app)
      .post(`/api/url`)
      .set("authorization", token)
      .send(urlData);
    newCreatedURLId = res.body.data.id;

    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      message: "Success",
      data: { ...urlData, userId, id: newCreatedURLId },
    });
  });

  it("Should find the url checking task in the tasks queue", async () => {
    let taskFound = (await queueTasks.task.getJobs([])).find(
      (job) => String(job.data.urlId) === String(newCreatedURLId)
    );
    expect(taskFound).toMatchObject({
      data: {
        urlId: newCreatedURLId,
      },
    });
  });
});

describe("GET /api/url/:urlId", () => {
  it("should return 403 && Not authorized if no token set", async () => {
    const res = await request(app).get(`/api/url/${newCreatedURLId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  });

  it("should return 400 &&  query validation error when not passing valid url id", async () => {
    const res = await request(app)
      .get(`/api/url/r`)
      .set("authorization", token);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toMatchObject({ error: { message: "Invalid url id" } });
  });

  it("should return 200 && valid response if request body is valid and the task found", async () => {
    const res = await request(app)
      .get(`/api/url/${newCreatedURLId}`)
      .set("authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "Successfull read request",
      data: { ...urlData, userId, id: newCreatedURLId },
    });
  });
});

describe("GET /api/url", () => {
  it("should return 403 && Not authorized if no token set", async () => {
    const res = await request(app).get(`/api/url`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  });

  it("should return 422 &&  query validation error when not passing valid page or limit", async () => {
    const res = await request(app)
      .get(`/api/url?page=r`)
      .set("authorization", token);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toMatchObject({ error: { type: "query validation" } });
  });

  it("should return 200 && valid response if request body is valid and the tasks found", async () => {
    const res = await request(app).get(`/api/url`).set("authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Successfull read request");
    expect(res.body.data[0]).toMatchObject({
      ...urlData,
      userId,
      id: newCreatedURLId,
    });
  });
});

describe("POST /api/url/REPORT", () => {
  it("should return 200 && valid report list", async () => {
    await new Promise((r) => setTimeout(r, intervalMilliSeconds));
    const res = await request(app)
      .post(`/api/url/report`)
      .set("authorization", token)
      .send({ tags: ["bosta"] });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Successfull read request");

    let url = res.body.data[0];

    expect(url).toHaveProperty("currentStatus");
    expect(url).toHaveProperty("availability");
    expect(url).toHaveProperty("outages");
    expect(url).toHaveProperty("uptime");
    expect(url).toHaveProperty("downTime");
    expect(url).toHaveProperty("avgResponseTime");
    let lastLog = url.logs[0];
    expect(lastLog).toHaveProperty("responseTime");
    expect(lastLog).toHaveProperty("statusCode");
    expect(lastLog).toHaveProperty("status");
  });

  it("should return 403 && Not authorized if no token set", async () => {
    const res = await request(app).post(`/api/url/report`);
    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  });

  it("should return 422 &&  body validation error when not passing valid tags, page or limit", async () => {
    const res = await request(app)
      .post(`/api/url/report`)
      .send({ page: "invalid", limit: "invalid", tags: [] })
      .set("authorization", token);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toMatchObject({ error: { type: "body validation" } });
  });
});

describe("POST /api/url/REPORT/:urlId", () => {
  it("should return 200 && valid single report", async () => {
    await new Promise((r) => setTimeout(r, intervalMilliSeconds));
    const res = await request(app)
      .post(`/api/url/report/${newCreatedURLId}`)
      .set("authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Successfull read request");

    expect(res.body.data).toHaveProperty("urlReport");
    expect(res.body.data).toHaveProperty("logs");

    expect(res.body.data.urlReport).toHaveProperty("currentStatus");
    expect(res.body.data.urlReport).toHaveProperty("availability");
    expect(res.body.data.urlReport).toHaveProperty("outages");
    expect(res.body.data.urlReport).toHaveProperty("uptime");
    expect(res.body.data.urlReport).toHaveProperty("downTime");
    expect(res.body.data.urlReport).toHaveProperty("avgResponseTime");

    let lastLog = res.body.data.logs[0];
    expect(lastLog).toHaveProperty("responseTime");
    expect(lastLog).toHaveProperty("statusCode");
    expect(lastLog).toHaveProperty("status");
  });

  it("should return 403 && Not authorized if no token set", async () => {
    const res = await request(app).post(`/api/url/report/${newCreatedURLId}`);
    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  });

  it("should return 422 &&  body validation error when not passing valid page or limit", async () => {
    const res = await request(app)
      .post(`/api/url/report/${newCreatedURLId}`)
      .send({ page: "invalid", limit: "invalid" })
      .set("authorization", token);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toMatchObject({ error: { type: "body validation" } });
  });

  it("should return 400 && if invalid report url id", async () => {
    const res = await request(app)
      .post(`/api/url/report/s`)
      .set("authorization", token);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toMatchObject({ error: { message: "Invalid url id" } });
  });
});

describe("PUT /api/url", () => {
  it("should return 200 && valid response if request body is valid and the task found", async () => {
    const res = await request(app)
      .put(`/api/url`)
      .set("authorization", token)
      .send({ ...dataToBeUpdated, urlId: newCreatedURLId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "URL has been updated",
      data: { ...dataToBeUpdated },
    });
  });

  it("should return 403 && Not authorized if no token set", async () => {
    const res = await request(app).put(`/api/url`).send(dataToBeUpdated);
    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  });

  it("should return 422 &&  query validation error when missingvalid url id", async () => {
    delete dataToBeUpdated.urlId;
    const res = await request(app)
      .put(`/api/url`)
      .set("authorization", token)
      .send(dataToBeUpdated);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toMatchObject({ error: { type: "body validation" } });
  });
});

describe("DEL /api/url", () => {
  it("should return 403 && Not authorized if no token set", async () => {
    const res = await request(app).delete(`/api/url?urlId=${newCreatedURLId}`);
    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      error: {
        message: "Not Authorized",
        status: 403,
      },
    });
  });

  it("should return 422 &&  query validation error when not passing valid url id", async () => {
    const res = await request(app)
      .delete(`/api/url?urlId=r`)
      .set("authorization", token);

    expect(res.statusCode).toEqual(422);
    expect(res.body).toMatchObject({ error: { type: "query validation" } });
  });

  it("should return 200 && valid response if request body is valid and the task found", async () => {
    const res = await request(app)
      .delete(`/api/url?urlId=${newCreatedURLId}`)
      .set("authorization", token);
    expect(res.body).toMatchObject({
      message: "URL has been deleted",
      data: { ...dataToBeUpdated, userId, id: newCreatedURLId },
    });
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 && not found task after trying to delete it again", async () => {
    const res = await request(app)
      .delete(`/api/url?urlId=${newCreatedURLId}`)
      .set("authorization", token);

    expect(res.statusCode).toBe(404);
    expect(res.body).toMatchObject({
      error: {
        message: "url is not found",
        status: 404,
      },
    });
  });

  /* it("Should not find the url checking task in the tasks queue", async () => {
    let taskFound = (await queueTasks.task.getJobs([])).find(
      (job) => String(job.data.urlId) === String(newCreatedURLId)
    );
    expect(taskFound).toBe(undefined);
  }); */
});

afterAll(async () => {
  await sequelize.close();
  await queueTasks.task.removeAllListeners();
});
