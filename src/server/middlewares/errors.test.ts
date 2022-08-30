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
  const req = {};
  const next = jest.fn();
  describe("When it's called", () => {
    test("Then it should response with a status with the received error code and an error message", async () => {
      const error = {
        code: 356,
        publicMessage: "Total error!",
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };

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

    describe("When it's called without a code", () => {
      test("Then it should response with a status code 500", async () => {
        const error = {
          code: null as number,
          publicMessage: null as string,
        };

        const requestTest = {};
        const responseTest = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockResolvedValue(error.publicMessage),
        };

        const nextTest = jest.fn();
        const resolvedJson = { error: "Everything went wrong" };

        const expectedStatus = 500;

        await generalError(
          error as ICustomError,
          requestTest as unknown as Request,
          responseTest as unknown as Response,
          nextTest as NextFunction
        );

        expect(responseTest.status).toBeCalledWith(expectedStatus);
        expect(responseTest.json).toBeCalledWith(resolvedJson);
      });
    });
  });
});
