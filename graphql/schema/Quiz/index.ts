export const quizTypes = `
  type QuizItem {
    _id: Int!
    question: String!
    choices: [String]!
    answer: String!
    anecdote: String
  }
  type QuizItemsByLevel {
    beginner: [QuizItem]!
    intermediate: [QuizItem]!
    expert: [QuizItem]!
  }
  type Quiz {
    _id: ID!
    category: Category!
    theme: String!
    subTheme: String!
    difficulty: Int!
    quizItems: QuizItemsByLevel!
  }
`;

export const quizInputs = `
  input QuizItemInput {
    _id: Int!
    question: String!
    choices: [String]!
    answer: String!
    anecdote: String
  }
  input QuizItemsByLevelInput {
    beginner: [QuizItemInput]!
    intermediate: [QuizItemInput]!
    expert: [QuizItemInput]!
  }
  input QuizInput {
    category: ID!
    theme: String!
    subTheme: String!
    difficulty: Int!
    quizItems: QuizItemsByLevelInput!
  }
`;

export const quizQueries = `
  quizes: [Quiz!]
  quiz(id:ID!): Quiz!
  randomQuizId: ID!
`;

export const quizMutations = `
  createQuiz(quizInput:QuizInput!): Quiz!
  deleteQuiz(id:ID!): Quiz!
`;
