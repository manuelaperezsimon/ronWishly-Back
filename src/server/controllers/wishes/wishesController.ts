import { NextFunction, Request, Response } from "express";
import { decode, JwtPayload } from "jsonwebtoken";
import Wish from "../../../database/models/Wish";
import CustomError from "../../../utils/CustomError";

export const getAllWishes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.get("Authorization").slice(7);
    const userId = (decode(token) as JwtPayload).id;
    const wishes = await Wish.find({ owner: userId });

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

export const deleteWish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deleteWishItem = await Wish.findByIdAndDelete(id);
    if (deleteWishItem) {
      res.status(200).json({ message: "Wish deleted correctly" });
    }
  } catch (error) {
    const newError = new CustomError(
      404,
      "Error while deleting wish",
      "Error while deleting wish"
    );
    next(newError);
  }
};
