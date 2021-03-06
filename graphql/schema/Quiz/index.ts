export const quizTypes = `
  type QuizItem {
    quizItemId: Int!
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
  type QuizItemData {
    quizItemSignature: String!
    category: Category!
    theme: String!
    subTheme: String!
    level: String!
    quiz: QuizItem!
  }
`;

export const quizInputs = `
  input QuizItemInput {
    quizItemId: Int!
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
  input QuizItemSignatureInput {
    quizId:ID!
    level:String!
    quizItemId:Int!
  }
`;

export const quizQueries = `
  quizItemData(quizItemSignature:QuizItemSignatureInput!): QuizItemData!
  quizzesItemsData(quizItemsSignatures:[QuizItemSignatureInput]): [QuizItemData!]
`;

export const quizMutations = `
  createQuiz(quizInput:QuizInput!): Quiz!
  deleteQuiz(id:ID!): Quiz!
`;
