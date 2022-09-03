import { NextFunction, Request, Response } from "express";
import Wish from "../../../database/models/Wish";
import CustomError from "../../../utils/CustomError";

const getAllWishes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const wishes = await Wish.find();

    if (wishes.length === 0) {
      res.status(404).json({ wishes: "No wishes found" });
      return;
    }

    res.status(200).json({ wishes });
  } catch (error) {
    const newError = new CustomError(
      404,
      "Error while getting wishes",
      "No wishes found"
    );

    next(newError);
  }
};

export default getAllWishes;
