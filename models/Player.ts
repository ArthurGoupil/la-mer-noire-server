import { Schema, model, Document } from "mongoose";

export interface Player extends Document {
  _id: string;
  name: string;
  createdAt: string;
  updatedAd?: string;
}

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const playerModel = model<Player>("Player", playerSchema);

export default playerModel;
