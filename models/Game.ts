import { Schema, model } from "mongoose";

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    players: [{ type: Schema.Types.ObjectId, ref: "Player", default: [] }],
  },
  { timestamps: true },
);

const userModel = model("Game", gameSchema);

export default userModel;
