import { NextFunction, Request, Response } from "express";
import Wish from "../../../database/models/Wish";
import { IWish } from "../../../interfaces/wishesInterface";
import CustomError from "../../../utils/CustomError";
import getAllWishes from "./wishesController";

describe("Given a getAllwishes function", () => {
  const mockWish: IWish = {
    title: "Viajar",
    picture: "",
    limitDate: new Date(),
    description: "Por europa",
  };

  const req = {} as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn() as NextFunction;

  describe("When it's called with a request, response and a next function", () => {
    test("Then it should response with a status 200", async () => {
      Wish.find = jest.fn().mockReturnValue([mockWish]);

      const expectedStatus = 200;

      await getAllWishes(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should respond with all the wishes found", async () => {
      const expectedResponse = {
        wishes: [mockWish],
      };

      await getAllWishes(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but doesn't return any valid data", () => {
    test("Then it should call next function with an error", async () => {
      Wish.find = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CustomError(
        404,
        "Error while getting wishes",
        "No wishes found"
      );

      await getAllWishes(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When called but there are no wishes avaliables", () => {
    test("Then it should respond with 'Error while getting wishes' message", async () => {
      Wish.find = jest.fn().mockReturnValue([]);

      const expectedError = { wishes: "No wishes found" };
      const status = 404;

      await getAllWishes(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
