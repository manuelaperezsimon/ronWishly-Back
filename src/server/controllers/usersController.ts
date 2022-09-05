import { NextFunction, Request, Response } from "express";
import User from "../../database/models/User";
import {
  CustomJwtPayload,
  LoginData,
  UserRegister,
} from "../../interfaces/usersInterfaces";
import { createToken, hashCompare, hashCreator } from "../../utils/auth";
import CustomError from "../../utils/CustomError";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserRegister = req.body;
  user.password = await hashCreator(user.password);

  try {
    await User.create(user);
    res.status(201).json({ message: "User created" });
  } catch (error) {
    const customError = new CustomError(
      409,
      error.message,
      "Error creating new user"
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body as LoginData;

  const userError = new CustomError(
    403,
    "User not found",
    "User or password not valid"
  );

  let findUser: Array<LoginData>;

  try {
    findUser = await User.find({ userName: user.userName });

    if (findUser.length === 0) {
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      403,
      "User not found",
      "User or password not valid"
    );
    next(finalError);
    return;
  }

  try {
    const isPasswordValid = await hashCompare(
      user.password,
      findUser[0].password
    );

    if (!isPasswordValid) {
      userError.message = "Password not valid";
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = new CustomError(
      403,
      "Invalid password",
      "User or password invalid"
    );
    next(finalError);
    return;
  }

  const payload: CustomJwtPayload = {
    id: findUser[0].userName,
    userName: findUser[0].userName,
  };

  const responseData = {
    token: createToken(payload),
  };

  res.status(200).json(responseData);
};
