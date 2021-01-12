import { Schema, model } from "mongoose";

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const playerModel = model("Player", playerSchema);

export default playerModel;
