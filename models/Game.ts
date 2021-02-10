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
    players: {
      _id: false,
      type: [
        {
          player: {
            type: Schema.Types.ObjectId,
            ref: "Player",
            required: true,
          },
          points: {
            type: Number,
            default: 0,
            required: true,
          },
        },
      ],
      default: [],
      required: true,
    },
    currentPlayers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Player",
        },
      ],
      default: [],
      required: true,
    },
    currentQuizItem: {
      quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
      },
      level: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        required: true,
      },
      quizItemId: {
        type: String,
        required: true,
      },
      createdAtTimestamp: {
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true },
);

const gameModel = model("Game", gameSchema);

export default gameModel;
