import request from "supertest";
import faker from "@faker-js/faker";
import { app } from "../src/app";
import { sequelize } from "../src/connection/database";
jest.setTimeout(30000);
let email: string;
let username: string;
let password: string;

beforeAll(async () => {
  await sequelize.sync({ force: true }).catch(console.error);
  email = faker.internet.email();
  username = faker.internet.userName();
  password = faker.random.alpha({ count: 10 });
});

describe("POST /API/AUTH/REGISTER", () => {
  it("should return 200 && valid response if request body is valid", async () => {
    const res = await request(app)
      .post(`/api/auth/register`)
      .send({
        email,
        password,
        username,
      })
      .expect("Content-Type", /json/);

    expect(res.body).toMatchObject({ data: { email, username } });
    expect(res.statusCode).toEqual(200);
  });

  it("should return 422 & error response if request body is missing", async () => {
    const res = await request(app).post(`/api/auth/register`).send({
      email,
    });

    expect(res.body).toMatchObject({ error: { type: "body validation" } });
    expect(res.statusCode).toEqual(422);
  });

  it("should return 400 && valid response if email or already exists", async () => {
    const res = await request(app)
      .post(`/api/auth/register`)
      .send({
        email,
        password,
        username,
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(res.body).toMatchObject({
      error: { message: "Email alreay exists", status: 400 },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /API/AUTH/LOGIN", () => {
  it("should return 200 && error response if email found", async () => {
    const res = await request(app)
      .post(`/api/auth/login`)
      .send({
        email,
        password,
      })
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);

    expect(res.body).toMatchObject({
      message: "Welcome back",
      data: {
        user: {
          email,
          username,
        },
      },
    });

    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user).toHaveProperty("createdAt");
  });

  it("should return 422 & error response if request body is missing", async () => {
    const res = await request(app).post(`/api/auth/login`).send({
      email,
    });
    expect(res.body).toMatchObject({ error: { type: "body validation" } });
    expect(res.statusCode).toEqual(422);
  });

  it("should return 401 & error response if email or password are invalid", async () => {
    const res = await request(app).post(`/api/auth/login`).send({
      email,
      password: "Invalid password",
    });

    expect(res.body).toMatchObject({
      error: { message: "Invalid email or password", status: 401 },
    });

    expect(res.statusCode).toEqual(401);
  });
});
afterAll((done) => {
  sequelize.close();
  done();
});
