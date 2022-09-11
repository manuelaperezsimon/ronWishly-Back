import express from "express";
import multer from "multer";
import {
  createWish,
  deleteWish,
  getAllWishes,
  getById,
  modifyWish,
} from "../../controllers/wishes/wishesController";
import { authentication } from "../../middlewares/authentication";
import parseData from "../../middlewares/parseData";

const wishesRouter = express.Router();
const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

wishesRouter.get("/", authentication, getAllWishes);
wishesRouter.delete("/:id", authentication, deleteWish);
wishesRouter.get("/:id", authentication, getById);
wishesRouter.post("/", upload.single("picture"), parseData, createWish);
wishesRouter.put("/:id", upload.single("picture"), parseData, modifyWish);

export default wishesRouter;
