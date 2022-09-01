import express from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../controllers/usersController";
import {
  loginValidation,
  registerValidation,
} from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post("/register", validate(registerValidation), registerUser);
usersRouter.post("/login", validate(loginValidation), loginUser);

export default usersRouter;
