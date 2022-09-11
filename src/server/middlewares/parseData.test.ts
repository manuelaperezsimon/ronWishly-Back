import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

import parseData from "./parseData";

jest.useFakeTimers();

describe("Given a parseData middleware", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockedReqBody = {
      wish: JSON.stringify({
        title: "",
        limitDate: new Date(),
        description: "",
      }),
    };

    jest
      .spyOn(path, "join")
      .mockReturnValue(`${path.join("uploads", "pictures")}`);

    jest.spyOn(fs, "rename").mockResolvedValue();

    const req = {
      body: mockedReqBody,
      file: { filename: "wish2", originalname: "wish2" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await parseData(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    test("Then it should asign the data as req body", async () => {
      const reqWithoutImage = {
        body: mockedReqBody,
      } as Partial<Request>;

      const customError = new CustomError(404, "Missing data", "Missing data");
      await parseData(reqWithoutImage as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
