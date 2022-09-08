import express from "express";
import {
  deleteWish,
  getAllWishes,
  getById,
} from "../../controllers/wishes/wishesController";
import { authentication } from "../../middlewares/authentication";

const wishesRouter = express.Router();

wishesRouter.get("/", authentication, getAllWishes);
wishesRouter.delete("/:id", authentication, deleteWish);
wishesRouter.get("/:id", authentication, getById);

export default wishesRouter;
