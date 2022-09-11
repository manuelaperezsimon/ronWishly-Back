import { NextFunction, Request, Response } from "express";
import Wish from "../../../database/models/Wish";
import { IWish } from "../../../interfaces/wishesInterface";
import CustomError from "../../../utils/CustomError";
import {
  createWish,
  deleteWish,
  getAllWishes,
  getById,
  modifyWish,
} from "./wishesController";

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  decode: jest.fn().mockReturnValue({
    id: "1234grew43d",
  }),
}));

jest.mock("../../../database/models/Wish", () => ({
  ...jest.requireActual("../../../database/models/Wish"),
  find: jest.fn().mockReturnValue([
    {
      title: "Viajar",
      picture: "",
      limitDate: new Date(),
      description: "Por europa",
    },
  ]),
  create: jest.fn(),
}));

describe("Given a getAllwishes function", () => {
  const req = {
    get: (name: string) => `Bearer ${name}`,
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const mockWish: IWish = {
    title: "Viajar",
    picture: "",
    limitDate: expect.any(Date),
    description: "Por europa",
  };

  const next = jest.fn() as NextFunction;

  describe("When it's called with a request, response and a next function", () => {
    test("Then it should response with a status 200", async () => {
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
        200,
        "Error while getting wishes",
        "No wishes found"
      );

      await getAllWishes(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a deleteWish function", () => {
  describe("When it's called with a request, response and a next function", () => {
    test("Then it should respond with a status 200 and a confirmation of delete with a message 'Wish deleted correctly'", async () => {
      const requestTest = {
        params: { id: "62e0ajh9b455361" },
      } as Partial<Request>;

      const expectedStatus = 200;
      const expectedMessage = { message: "Wish deleted correctly" };
      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      Wish.findByIdAndDelete = jest.fn().mockResolvedValue(expectedMessage);

      await deleteWish(requestTest as Request, responseTest as Response, next);

      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseTest.json).toHaveBeenCalledWith(expectedMessage);
    });

    describe("When it receives a request to delete an item but can't find it", () => {
      test("Then it should throw a CustomError with 404 as code", async () => {
        const requestTest = {
          params: { id: "" },
        } as Partial<Request>;

        const expectedError = new CustomError(
          404,
          "Error while deleting wish",
          "Error while deleting wish"
        );

        Wish.findByIdAndDelete = jest.fn().mockRejectedValue(expectedError);

        const next = jest.fn() as NextFunction;

        const responseTest = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as Partial<Response>;

        await deleteWish(
          requestTest as Request,
          responseTest as Response,
          next
        );

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });

    describe("When it receives a request to delete an item but the value is null", () => {
      test("Then it should send a response with the method status 404", async () => {
        const requestTest = {
          params: { id: "132425" },
        } as Partial<Request>;

        const expectedResult: void = null;

        Wish.findByIdAndDelete = jest.fn().mockResolvedValue(expectedResult);

        const expectedStatus = 404;

        const responseTest = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        } as Partial<Response>;

        const next = jest.fn() as NextFunction;

        await deleteWish(
          requestTest as Request,
          responseTest as Response,
          next
        );

        expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
      });
    });
  });
});

describe("Given a getById function", () => {
  describe("When it's called with a request, response and next function", () => {
    test("Then it show response with a status 200 and the wish found", async () => {
      const mockWish: IWish = {
        title: "Viajar",
        picture: "",
        limitDate: expect.any(Date),
        description: "Por europa",
      };
      const requestTest = {
        params: { id: "62e0ajh9b455361" },
      } as Partial<Request>;

      const expectedStatus = 200;
      const expectedResult = { wish: mockWish };
      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      Wish.findById = jest.fn().mockResolvedValue(expectedResult);

      await getById(requestTest as Request, responseTest as Response, next);
      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request to find a wish, but can't find it", () => {
    test("Then it should response with 404 as code", async () => {
      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const expectedStatus = 404;

      Wish.findById = jest.fn().mockReturnValue("");

      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await getById(requestTest as Request, responseTest as Response, next);

      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request to find a wish, but has error while finding the wish requested", () => {
    test("Then it should call next function with an error", async () => {
      Wish.findById = jest.fn().mockRejectedValue(new Error());

      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const expectedError = new CustomError(
        404,
        "No wishes found",
        "Error while finding the wish requested"
      );

      const next = jest.fn() as NextFunction;

      await getById(requestTest as Request, responseTest as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createWish function", () => {
  describe("When it's called with a request, response and next function", () => {
    test("Then it show response with a status 201 and the created wish", async () => {
      const mockCreate = Wish.create as jest.Mock;

      mockCreate.mockResolvedValue({
        id: "12345",
        picture: "japan.png",
        limitDate: new Date(),
        description: "hola hola",
        title: "Viajando",
      });

      const req = {
        get: (name: string) => `Bearer ${name}`,
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as NextFunction;

      const expectedStatus = 201;

      await createWish(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it's called with a request, response and next function with a invalid properties", () => {
    test("Then it call next with a custom error", async () => {
      Wish.create = jest.fn().mockRejectedValue(new Error());

      const req = {
        get: (name: string) => `Bearer ${name}`,
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const next = jest.fn() as NextFunction;

      const expectedError = new CustomError(
        400,
        "Error creating wish",
        "Could not create the wish"
      );

      await createWish(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a modifyWish function", () => {
  describe("When it's called with a request, response and next function", () => {
    test("Then it show response with a status 200 and the modified wish", async () => {
      const upDatedWish = {
        id: "62e0ajh9b455361",
        title: "Nadaremos en el mar",
        picture: "mar.png",
        limitDate: new Date(),
        description: "en el mar el mar el mar",
      };

      const requestTest = {
        body: upDatedWish,
        params: { id: "62e0ajh9b455361" },
      } as Partial<Request>;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ upDatedWish }),
      };

      Wish.findByIdAndUpdate = jest.fn().mockResolvedValue(upDatedWish);

      const expectedStatus = 200;

      const next = jest.fn() as NextFunction;

      await modifyWish(requestTest as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ upDatedWish });
    });

    test("Then it should next with an error if it cannot complete the update", async () => {
      const errorTest = new CustomError(
        400,
        "Error to modify wish",
        "Could not modify the wish"
      );

      Wish.findByIdAndUpdate = jest.fn().mockRejectedValue(errorTest);

      const req = {
        params: { id: "" },
      } as Partial<Request>;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue([]),
      };
      const next = jest.fn();

      await modifyWish(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(errorTest);
    });
  });
});
