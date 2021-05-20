import { QuizItemId } from "../models/Quiz";

export const getRandomQuizItemId = (): QuizItemId => {
  return (Math.floor(Math.random() * 10) + 1) as QuizItemId;
};
