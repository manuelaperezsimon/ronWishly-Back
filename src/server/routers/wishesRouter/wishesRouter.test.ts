import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import Wish from "../../../database/models/Wish";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterEach(async () => {
  await Wish.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a GET endpoint", () => {
  describe("When it receives a request with method get", () => {
    test("Then it should response with status 200", async () => {
      const expectedStatus = 200;

      await Wish.create({
        title: "Viajar a Japón",
        image: "japon.png",
        limitDate: new Date(),
        description: "Nos vamos a ver los árboles",
      });

      await request(app).get("/wishes").expect(expectedStatus);
    });
  });

  describe("When it receives a request with method get but there isn't any object on the database", () => {
    test("Then it should throw a 'No wishes found' error", async () => {
      const expectedStatus = 404;

      await request(app).get("/wishes").expect(expectedStatus);
    });
  });
});
