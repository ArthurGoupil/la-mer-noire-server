import { Schema, model } from "mongoose";

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

const quizModel = model("Quiz", quizSchema);

export default quizModel;
