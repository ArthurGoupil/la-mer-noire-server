import { Schema, model } from "mongoose";
import { EGameStage } from "../constants/GameStage.constants";

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
    stage: {
      type: String,
      enum: Object.values(EGameStage),
      default: EGameStage.playersRegistration,
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
    currentPlayers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
        default: [],
        required: true,
      },
    ],
    currentQuizItem: {
      quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
      level: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
      },
      quizItemId: {
        type: Number,
      },
    },
  },
  { timestamps: true },
);

const gameModel = model("Game", gameSchema);

export default gameModel;
