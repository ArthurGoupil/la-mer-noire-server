import { Schema, model, Document } from "mongoose";
import { Category } from "./Category";

type QuizItemId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
enum EQuizLevel {
  beginner = "beginner",
  intermediate = "intermediate",
  expert = "expert",
}
export interface QuizLevel {
  level: EQuizLevel;
}

export interface PlayersCanAnswer {
  playersCanAnswer: boolean;
}

interface QuizItem {
  quizItemId: QuizItemId;
  question: string;
  choices: string[];
  answer: string;
  anecdote?: string;
}

interface Quiz extends Document {
  _id: string;
  category: Category;
  theme: string;
  subTheme: string;
  difficulty: number;
  quizItems: { [key in EQuizLevel]: QuizItem[] };
}

const quizSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    theme: { type: String, required: true },
    subTheme: { type: String, required: true },
    difficulty: { type: Number, required: true },
    quizItems: {
      beginner: {
        type: [
          {
            quizItemId: { type: Number, required: true },
            question: { type: String, required: true },
            choices: { type: [String], required: true },
            answer: { type: String, required: true },
            anecdote: { type: String },
          },
        ],
        required: true,
      },
      intermediate: {
        type: [
          {
            quizItemId: { type: Number, required: true },
            question: { type: String, required: true },
            choices: { type: [String], required: true },
            answer: { type: String, required: true },
            anecdote: { type: String },
          },
        ],
        required: true,
      },
      expert: {
        type: [
          {
            quizItemId: { type: Number, required: true },
            question: { type: String, required: true },
            choices: { type: [String], required: true },
            answer: { type: String, required: true },
            anecdote: { type: String },
          },
        ],
        required: true,
      },
    },
  },
  { timestamps: true },
);

const quizModel = model<Quiz>("Quiz", quizSchema);

export default quizModel;
