import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import CustomError from "../../utils/CustomError";
import { loginUser, registerUser } from "./usersController";

let mockHashCreatorValue: boolean | jest.Mock = true;
let mockHashCompareValue = true;

jest.mock("../../utils/auth", () => ({
  ...jest.requireActual("../../utils/auth"),
  createToken: () => jest.fn().mockReturnValue("#"),
  hashCreator: () => mockHashCreatorValue,
  hashCompare: () => mockHashCompareValue,
}));

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

describe("Given a loginUser controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fakeUserTest = {
    id: "12345678",
    userName: "Laurita",
    password: "veintinueve",
  };

  const req: Partial<Request> = { body: fakeUserTest };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  User.find = jest.fn().mockReturnValue([fakeUserTest]);

  describe("When it's called with a request, response and next", () => {
    test("Then it should call status function with code 200", async () => {
      mockHashCompareValue = true;

      const status = 200;

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the json method of the response", async () => {
      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalled();
    });

    test("Then it should call the next function with the created error", async () => {
      User.find = jest.fn().mockReturnValue([]);
      const errorTest = new CustomError(
        403,
        "User not found",
        "User or password not valid"
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(errorTest);
    });

    test("It should call the next function with the created error if an user not found and throw a error", async () => {
      mockHashCreatorValue = jest.fn().mockReturnValue(true);

      User.find = jest.fn().mockRejectedValue(new Error());

      await loginUser(req as Request, res as Response, next as NextFunction);

      const customError = new CustomError(
        400,
        "User not found",
        "User or password not valid"
      );

      expect(next).toHaveBeenCalledWith(customError);
    });

    test("It should call next with an error, if the password is wrong,", async () => {
      User.find = jest.fn().mockReturnValue(false);
      mockHashCompareValue = false;

      const expectedError = new CustomError(
        403,
        "Invalid password",
        "User or password invalid"
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });

    test("Then it should call the next function with the created error if the passwords don't match", async () => {
      const notValidPassword = {
        userName: "Carito",
        password: "mapeomapeo",
      };

      User.find = jest.fn().mockReturnValue([notValidPassword]);
      mockHashCompareValue = false;

      const userError = new CustomError(
        403,
        "Password not valid",
        "User or password invalid"
      );

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(userError);
    });
  });
});
