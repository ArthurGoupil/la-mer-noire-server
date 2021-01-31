import Quiz from "../../../models/Quiz";

interface Id {
  id: string;
}

interface QuizItemInput {
  _id: number;
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
      beginner: [QuizItemInput];
      intermediate: [QuizItemInput];
      expert: [QuizItemInput];
    };
  };
}

const resolvers = {
  Query: {
    quizes: async () => {
      try {
        return await Quiz.find().populate("category");
      } catch (error) {
        throw error;
      }
    },
    quiz: async (root, { id }: Id) => {
      try {
        return await Quiz.findById(id).populate("category");
      } catch (error) {
        throw error;
      }
    },
    randomQuizId: async () => {
      try {
        return (
          await Quiz.aggregate([
            {
              $sample: { size: 1 },
            },
          ])
        )[0]._id;
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
