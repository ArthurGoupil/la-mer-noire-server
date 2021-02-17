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

interface QuizResponse {
  category: { _id: string; name: string };
  theme: string;
  subTheme: string;
  quizItems: [QuizItem];
}

const resolvers = {
  Query: {
    quizItemData: async (
      root,
      { quizId, level, quizItemId, createdAtTimestamp }: QuizItemDataInput,
    ) => {
      try {
        const quiz: unknown = await Quiz.findById(quizId).populate("category");
        const { category, theme, subTheme, quizItems } = quiz as QuizResponse;

        return {
          quizId,
          category,
          theme,
          subTheme,
          level,
          createdAtTimestamp,
          quiz: quizItems[level].find(
            (quiz: QuizItem) => quiz.quizItemId === quizItemId,
          ),
        };
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createQuiz: async (root, { quizInput }: QuizInput) => {
      try {
        const newQuiz = new Quiz(quizInput);
        return await newQuiz.save();
      } catch (error) {
        throw error;
      }
    },
    deleteQuiz: async (root, { id }: Id) => {
      try {
        return await Quiz.findOneAndDelete({ _id: id });
      } catch (error) {
        throw error;
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
