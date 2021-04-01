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
  currentPlayers: string[];
  playersCanAnswer: boolean;
  playersCanBuzz: boolean;
}

export interface PlayersCanAnswer {
  playersCanAnswer: boolean;
}

export interface PlayersCanBuzz {
  playersCanBuzz: boolean;
}

export interface CurrentPlayers {
  currentPlayers: string[];
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
        type: String,
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
      playersCanAnswer: {
        type: Boolean,
      },
      playersCanBuzz: {
        type: Boolean,
      },
    },
  },
  { timestamps: true },
);

const gameModel = model<Game>("Game", gameSchema);

export default gameModel;
