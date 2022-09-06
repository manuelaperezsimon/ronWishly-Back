import express from "express";
import {
  deleteWish,
  getAllWishes,
} from "../../controllers/wishes/wishesController";
import { authentication } from "../../middlewares/authentication";

const wishesRouter = express.Router();

wishesRouter.get("/", authentication, getAllWishes);
wishesRouter.delete("/:id", authentication, deleteWish);

export default wishesRouter;
