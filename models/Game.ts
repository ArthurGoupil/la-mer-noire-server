import { Schema, model, Document } from "mongoose";
import { EGameStage } from "../constants/GameStage.constants";
import { QuizItemId, QuizItemLevel } from "../graphql/resolvers/Quiz";
import { Player } from "../models/Player";

interface Game extends Document {
  _id: string;
  shortId: string;
  name: string;
  stage: EGameStage;
  players: [PlayerData];
  currentPlayers: Player[];
  currentQuizItem: CurrentQuizItem;
  createdAt: string;
  updatedAd?: string;
}

export interface PlayerData {
  player: Player;
  points: number;
}

interface CurrentQuizItem {
  quizId: string;
  level: QuizItemLevel;
  quizItemId: QuizItemId;
  createdAtTimestamp: number;
}

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
      },
    },
  },
  { timestamps: true },
);

const gameModel = model<Game>("Game", gameSchema);

export default gameModel;
