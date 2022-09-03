import { model, Schema } from "mongoose";

const wishSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  limitDate: {
    type: Date,
    default: new Date(),
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Robot = model("Wish", wishSchema, "wishes");

export default Robot;
