import express from "express";
import { validate } from "express-validation";
import { registerUser } from "../controllers/usersController";

import registerValidation from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post("/register", validate(registerValidation), registerUser);

export default usersRouter;
