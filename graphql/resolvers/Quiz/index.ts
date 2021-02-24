import { ApolloError } from "apollo-server-express";
import Quiz from "../../../models/Quiz";

interface Id {
  id: string;
}

interface QuizItem {
  quizItemId: number;
  question: string;
  choices: [string];
  answer: string;
  anecdote?: string;
}

interface QuizInput {
  quizInput: {
    quizNumber: number;
    category: string;
    theme: string;
    subTheme: string;
    difficulty: number;
    quizItems: {
      beginner: [QuizItem];
      intermediate: [QuizItem];
      expert: [QuizItem];
    };
  };
}

interface QuizItemDataInput {
  quizId: string;
  level: "beginner" | "intermediate" | "expert";
  quizItemId: number;
  createdAtTimestamp: number;
}

export type QuizItemId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type QuizItemLevel = "beginner" | "intermediate" | "expert";

const resolvers = {
  Query: {
    quizItemData: async (
      root,
      { quizId, level, quizItemId, createdAtTimestamp }: QuizItemDataInput,
    ) => {
      try {
        const quizData = await Quiz.findById(quizId).populate("category");
        const { category, theme, subTheme, quizItems } = quizData;
        const quiz = quizItems[level].find(
          (quiz) => quiz.quizItemId === quizItemId,
        );

        return {
          quizItemSignature: `${quizId}-${level}-${quiz.quizItemId}`,
          quizId,
          category,
          theme,
          subTheme,
          level,
          createdAtTimestamp,
          quiz,
        };
      } catch (error) {
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
  },
  Mutation: {
    createQuiz: async (root, { quizInput }: QuizInput) => {
      try {
        const newQuiz = new Quiz(quizInput);
        return await newQuiz.save();
      } catch (error) {
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
    deleteQuiz: async (root, { id }: Id) => {
      try {
        return await Quiz.findOneAndDelete({ _id: id });
      } catch (error) {
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
