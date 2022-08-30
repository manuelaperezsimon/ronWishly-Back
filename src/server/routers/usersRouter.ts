import express from "express";
import registerUser from "../controllers/usersController";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);

export default usersRouter;
