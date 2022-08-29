import { Response, Request, NextFunction } from "express";
import ICustomError from "../../interfaces/interfacesErrors";
import { generalError, notFoundError } from "./errors";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response object", () => {
    const testResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const testRequest = {} as Partial<Request>;

    test("Then it should call the response method status with 404", () => {
      const status = 404;

      notFoundError(testRequest as Request, testResponse as Response);

      expect(testResponse.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response method with a json object with an error property", () => {
      const ErrorResponse = { error: "Endpoint not found" };

      notFoundError(testRequest as Request, testResponse as Response);

      expect(testResponse.json).toHaveBeenCalledWith(ErrorResponse);
    });
  });
});

describe("Given an generalError function", () => {
  describe("When it's called", () => {
    test("Then it should respond with a status with the received error code and an error message", async () => {
      const error = {
        code: 356,
        publicMessage: "Total error!",
      };
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };
      const next = jest.fn();
      const status = 356;
      const responseJson = { error: error.publicMessage };

      await generalError(
        error as ICustomError,
        req as unknown as Request,
        res as unknown as Response,
        next as NextFunction
      );

      expect(res.status).toBeCalledWith(status);
      expect(res.json).toBeCalledWith(responseJson);
    });
  });
});
