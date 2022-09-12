import "../../loadEnvironment";
import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPA_KEY);

const supaBaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { picture } = req.body;
  const picturePath = path.join("uploads", picture);

  try {
    const fileData = await readFile(picturePath);

    const storage = supabase.storage.from("rinwishlypictures");

    const uploadResult = await storage.upload(picture, fileData);
    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }
    const { publicURL } = storage.getPublicUrl(picture);
    req.body.imageBackUp = publicURL;
    next();
  } catch (error) {
    const newError = new CustomError(
      500,
      "Couldn't upload or read the picture",
      "Error while reading and uploading the picture"
    );
    next(newError);
  }
};

export default supaBaseUpload;
