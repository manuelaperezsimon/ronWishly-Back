import "../../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import ICustomError from "../../interfaces/interfacesErrors";

const debug = Debug("ronwishly:server:middlewares:errors");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
};

export const generalError = (
  error: ICustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.code ?? 500;
  let errorMessage = error.publicMessage ?? "Everything went wrong";

  if (error instanceof ValidationError) {
    debug(chalk.red("Request validation errors: "));
    error.details.body.forEach((errorInfo) => {
      debug(chalk.red(errorInfo.message));
    });

    errorMessage = "Wrong data";
  }

  debug(chalk.red(error.message));

  res.status(errorCode).json({ error: errorMessage });
};
