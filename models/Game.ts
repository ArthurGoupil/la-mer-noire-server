import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    shortId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
        default: [],
        required: true,
      },
    ],
    currentState: {
      type: { type: String, default: "playersRegistration", required: true },
      _id: { type: String },
    },
  },
  { timestamps: true },
);

const gameModel = model("Game", gameSchema);

export default gameModel;
