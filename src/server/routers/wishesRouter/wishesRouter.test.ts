import request from "supertest";
import { decode } from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import Wish from "../../../database/models/Wish";
import User from "../../../database/models/User";

let mongoServer: MongoMemoryServer;

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  decode: jest.fn(),
}));

jest.mock("../../middlewares/authentication", () => ({
  authentication: jest.fn().mockImplementation((req, res, next) => next()),
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterEach(async () => {
  await Wish.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
  await mongoServer.stop();
});

const mockDecode = decode as jest.Mock;

describe("Given a GET endpoint", () => {
  describe("When it receives a request with method get", () => {
    test("Then it should response with status 200", async () => {
      const expectedStatus = 200;

      const user = await User.create({
        userName: "holis",
        password: "23243545",
      });

      await Wish.create({
        title: "Viajar a Japón",
        picture: "japon.png",
        limitDate: new Date(),
        description: "Nos vamos a ver los árboles",
        owner: user,
      });

      mockDecode.mockReturnValue({
        id: "1234grew43d",
      });

      await request(app)
        .get("/wishes")
        .set("Authorization", "Bearer 434v45grgefr94i")
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request with method get but there isn't any object on the database", () => {
    test("Then it should throw a 'No wishes found' error", async () => {
      const expectedStatus = 200;

      await request(app).get("/wishes").expect(expectedStatus);
    });
  });
});

describe("Given a DELETE endpoint", () => {
  describe("When it receives a request with method delete", () => {
    test("Then it should response with status 200", async () => {
      const expectedStatus = 200;

      const user = await User.create({
        userName: "pedrito",
        password: "23243545",
      });

      const wish = await Wish.create({
        title: "Viajar a Japón",
        picture: "japon.png",
        limitDate: new Date(),
        description: "Nos vamos a ver los árboles",
        owner: user,
      });

      const idWish = wish.id;

      await request(app)
        .delete(`/wishes/${idWish}`)
        .set("Authorization", "Bearer 434v45grgefr94i")
        .expect(expectedStatus);
    });
  });
});
