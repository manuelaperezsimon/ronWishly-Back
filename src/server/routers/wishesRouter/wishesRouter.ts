import express from "express";
import getAllWishes from "../../controllers/wishes/wishesController";

const wishesRouter = express.Router();

wishesRouter.get("/", getAllWishes);

export default wishesRouter;
