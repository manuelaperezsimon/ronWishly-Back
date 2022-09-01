import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../interfaces/usersInterfaces";

export const hashCreator = (text: string) => {
  const salt = 10;

  return bcrypt.hash(text, salt);
};

const secretWord = process.env.SECRET;

export const createToken = (payload: CustomJwtPayload) =>
  jwt.sign(payload, secretWord);

export const hashCompare = (text: string, hash: string) =>
  bcrypt.compare(text, hash);
