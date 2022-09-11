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

    res.status(200).json({ wishes });
  } catch (error) {
    const newError = new CustomError(
      400,
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
    } else {
      res.status(404).send();
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

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const dbWish = await Wish.findById(id);

    if (!dbWish) {
      res.status(404).json({ wishes: "No wishes found" });
      return;
    }

    res.status(200).json({ wish: dbWish });
  } catch (error) {
    const newError = new CustomError(
      404,
      "No wishes found",
      "Error while finding the wish requested"
    );

    next(newError);
  }
};

export const createWish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rawWish = req.body;

  try {
    const token = req.get("Authorization").slice(7);
    const userId = (decode(token) as JwtPayload).id;
    const newWish = await Wish.create({ ...rawWish, owner: userId });

    res.status(201).json({ newWish });
  } catch (error) {
    const newError = new CustomError(
      400,
      "Error creating wish",
      "Could not create the wish"
    );

    next(newError);
  }
};

export const modifyWish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const wish = req.body;
  const { id } = req.params;

  try {
    const modifiedWish = {
      ...wish,
      title: wish.title,
      picture: wish.picture,
      limitDate: wish.limitDate,
      description: wish.description,
    };

    const upDatedWish = await Wish.findByIdAndUpdate(id, modifiedWish);
    res.status(200).json({ upDatedWish });
  } catch (error) {
    const newError = new CustomError(
      400,
      "Error to modify wish",
      "Could not modify the wish"
    );

    next(newError);
  }
};
