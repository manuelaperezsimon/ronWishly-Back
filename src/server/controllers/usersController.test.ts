import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import CustomError from "../../utils/CustomError";
import { registerUser } from "./usersController";

describe("Given a registerUser controller", () => {
  const messageTest = { message: "User created" };

  const userTest = {
    userName: "Gerard",
    password: "4567",
  };

  const requestTest = {
    body: {
      user: userTest,
    },
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const bcryptHashTest = jest.fn().mockResolvedValue("test");
  (bcrypt.hash as jest.Mock) = bcryptHashTest;

  const nextTest = jest.fn();

  describe("When it receives a response object", () => {
    test("Then it should invoke the response method status with 201", async () => {
      const status = 201;

      User.create = jest.fn();

      await registerUser(
        requestTest as Request,
        res as Response,
        nextTest as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("Then it should invoke the response method json with a new User", async () => {
      User.create = jest.fn().mockResolvedValue(messageTest);

      await registerUser(requestTest as Request, res as Response, nextTest);

      expect(res.json).toHaveBeenCalledWith(messageTest);
    });

    describe("When it doesn't receives an user with required properties", () => {
      test("Then it should nexted an error", async () => {
        const errorTest = new CustomError(400, "Error", "Public error");
        User.create = jest.fn().mockRejectedValue(errorTest);

        await registerUser(
          requestTest as Request,
          res as Response,
          nextTest as NextFunction
        );

        expect(nextTest).toBeCalledWith(errorTest);
      });
    });
  });
});
