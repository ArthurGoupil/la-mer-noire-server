import { QuizItemLevel } from "../models/Quiz";

interface GetScubadoobidooQuizItemsProps {
  index: number;
}

export const getScubadoobidooQuizItems = ({
  index,
}: GetScubadoobidooQuizItemsProps): QuizItemLevel => {
  let level: QuizItemLevel;
  if (index === 0 || index % 3 === 0) {
    level = "beginner";
  } else if (index - 1 === 0 || (index - 1) % 3 === 0) {
    level = "intermediate";
  } else {
    level = "expert";
  }

  return level;
};
