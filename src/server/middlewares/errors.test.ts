import { Response, Request, NextFunction } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../utils/CustomError";
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
      const error = new CustomError(356, "", "Everything went wrong");

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };

      const status = 356;
      const responseJson = { error: error.publicMessage };

      await generalError(
        error as CustomError,
        req as unknown as Request,
        res as unknown as Response,
        next as NextFunction
      );

      expect(res.status).toBeCalledWith(status);
      expect(res.json).toBeCalledWith(responseJson);
    });

    describe("When it's called with a status code null", () => {
      test("Then it should respond with a status code 500", async () => {
        const error = new CustomError(null, "", "");

        const requestTest = {};
        const responseTest = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockResolvedValue(error.publicMessage),
        };

        const nextTest = jest.fn();

        const expectedStatus = 500;

        await generalError(
          error as CustomError,
          requestTest as unknown as Request,
          responseTest as unknown as Response,
          nextTest as NextFunction
        );

        expect(responseTest.status).toBeCalledWith(expectedStatus);
      });

      describe("When it is instantiated with a publicMessage null", () => {
        test("Then it should give a response with the public message 'Everything went wrong'", async () => {
          const error = new CustomError(500, "", null);

          const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockResolvedValue(error.publicMessage),
          } as Partial<Response>;

          const expectedResponse = { error: "Everything went wrong" };

          await generalError(error, req as Request, response as Response, next);

          expect(response.json).toBeCalledWith(expectedResponse);
        });

        describe("When it's called with a ValidationError", () => {
          test("Then it should send a 400 status and error message", async () => {
            const errorTest = new ValidationError(
              {
                body: [
                  {
                    message: "Error 1",
                    isJoi: true,
                    annotate: () => "",
                    _original: "",
                    name: "ValidationError",
                    details: [],
                  },
                  {
                    message: "Error 2",
                    isJoi: true,
                    annotate: () => "",
                    _original: "",
                    name: "ValidationError",
                    details: [],
                  },
                ],
              },
              { statusCode: 400 }
            );

            const response = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            } as Partial<Response>;

            const expectedStatus = 400;

            await generalError(
              errorTest,
              req as Request,
              response as Response,
              next
            );

            expect(response.json).toBeCalledWith({ error: "Wrong data" });
            expect(response.status).toBeCalledWith(expectedStatus);
          });
        });
      });
    });
  });
});
