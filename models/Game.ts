import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const userModel = model("Game", gameSchema);

export default userModel;
