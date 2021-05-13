import { ApolloError } from "apollo-server-express";
import Quiz, { QuizItem } from "../../../models/Quiz";

interface Id {
  id: string;
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
}

const resolvers = {
  Query: {
    quizItemData: async (
      root,
      { quizId, level, quizItemId }: QuizItemDataInput,
    ) => {
      try {
        const quizData = await Quiz.findById(quizId).populate("category");
        const { category, theme, subTheme, quizItems } = quizData;
        const quiz = quizItems[level].find(
          (quiz) => quiz.quizItemId === quizItemId,
        );

        return {
          quizItemSignature: `${quizId}-${level}-${quiz.quizItemId}`,
          category,
          theme,
          subTheme,
          level,
          quiz,
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
  Mutation: {
    createQuiz: async (root, { quizInput }: QuizInput) => {
      try {
        const newQuiz = new Quiz(quizInput);
        return await newQuiz.save();
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    deleteQuiz: async (root, { id }: Id) => {
      try {
        return await Quiz.findOneAndDelete({ _id: id });
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
