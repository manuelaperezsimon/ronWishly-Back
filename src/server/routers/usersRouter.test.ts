import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "..";
import connectDB from "../../database";
import User from "../../database/models/User";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given an endpoint POST /users/register", () => {
  describe("When it receives a request with username 'andream' and password 'andrea123'", () => {
    test("Then it should response with status 201 and message 'User created'", async () => {
      const message = "User created";
      const { body } = await request(app)
        .post("/users/register")
        .send({ userName: "andream", password: "andrea123" })
        .expect(201);

      expect(body).toHaveProperty("message", message);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should response with estatus 400 and a message 'Wrong data'", async () => {
      const message = "Wrong data";
      const { body } = await request(app)
        .post("/users/register")
        .send({ userName: "andream" })
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});

describe("Given an endpoint POST /users/login", () => {
  describe("When it receives a request with username 'andream' and password 'andrea123'", () => {
    test("Then it should response with status 200 and the token", async () => {
      const mockUser = {
        userName: "ignacio",
        password: "ignacio",
      };

      await request(app).post("/users/register").send(mockUser);

      const userMockLogin = {
        userName: "ignacio",
        password: "ignacio",
      };
      const status = 200;

      await request(app)
        .post("/users/login")
        .send(userMockLogin)
        .expect(status);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should respond with a status of 400 if the password is not valid", async () => {
      const mockUser = {
        userName: "ignacio",
        password: "ignacio",
      };

      await request(app).post("/users/register").send(mockUser);

      const userMockLogin = {
        userName: "ignacio",
        password: "ignaci",
      };
      const status = 403;

      await request(app)
        .post("/users/login")
        .send(userMockLogin)
        .expect(status);
    });
  });
});
