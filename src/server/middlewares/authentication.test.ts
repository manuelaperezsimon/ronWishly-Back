import { NextFunction, Response } from "express";
import CustomError from "../../utils/CustomError";
import { authentication, CustomRequest } from "./authentication";

const mockVerifyToken = jest.fn();

jest.mock("../../utils/auth", () => ({
  ...jest.requireActual("../../utils/auth"),
  verifyToken: (token: string) => mockVerifyToken(token),
}));

describe("Given an authentication middleware", () => {
  describe("When it's invoked with request, respose and next function", () =>
    test("Then it should call next without parameter", () => {
      const req = {
        get: jest.fn().mockReturnValue("Bearer #"),
      } as Partial<CustomRequest>;

      const res = {} as Partial<Response>;
      const next = jest.fn() as NextFunction;

      const error = new CustomError(
        400,
        "Bad request",
        "Error of authentication"
      );

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(error);
      expect(req).toHaveProperty("payload");
    }));

  describe("And when is no 'Authorization' in the header", () => {
    test("Then it should call the next function with an error", () => {
      const req = {
        get: jest.fn().mockReturnValue(""),
      } as Partial<CustomRequest>;

      const res = {} as Partial<Response>;

      const next = jest.fn() as NextFunction;
      const error = new CustomError(
        400,
        "Bad request",
        "Error of authentication"
      );

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("And when the Authorization header at request doesn't start with 'Bearer '", () => {
    test("Then it should call the next function with an error", () => {
      const req = {
        get: jest.fn().mockReturnValue("Fake "),
      } as Partial<CustomRequest>;

      const res = {} as Partial<Response>;

      const next = jest.fn() as NextFunction;

      const error = new CustomError(
        400,
        "Bad request",
        "Error of authentication"
      );

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("And when the verifyToken function return a string", () => {
    test("Then it should call the next function with an error and a request without payload", () => {
      const req = {
        get: jest.fn().mockReturnValue("Bearer #"),
      } as Partial<CustomRequest>;

      const res = {} as Partial<Response>;

      const next = jest.fn() as NextFunction;

      const error = new CustomError(
        400,
        "Bad request",
        "Error of authentication"
      );

      mockVerifyToken.mockReturnValue("");

      authentication(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
      expect(req).not.toHaveProperty("payload");
    });
  });
});
