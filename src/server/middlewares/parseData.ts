import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newWish = req.body.wish;

    const wishObject = await JSON.parse(newWish);

    const newName = `${Date.now()}${req.file.originalname}`;
    wishObject.picture = newName;

    await fs.rename(
      path.join("uploads", req.file.filename),
      path.join("uploads", newName)
    );

    wishObject.picture = newName;

    req.body = wishObject;

    next();
  } catch (error) {
    const newError = new CustomError(404, "Missing data", "Missing data");
    next(newError);
  }
};

export default parseData;
