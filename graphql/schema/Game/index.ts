export const gameTypes = `
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    players: [Player]!
    createdAt: String!
  }
  type AnswerResponse {
    playerId: ID!
    answer: String!
  }
  type StageResponse {
    stage: String!
  }
  type CurrentQuizItemResponse {
    quizId: ID!
    level: String!
    quizItemId: Int!
  }
`;

export const gameInputs = `
  input CurrentQuizItem {
    quizId: ID!
    level: String!
    quizItemId: Int!
  }
`;

export const gameSubscriptions = `
  gamePlayersUpdated(shortId:String!): Game!
  gameStageUpdated(shortId:String!): StageResponse!
  gameCurrentQuizItemUpdated(shortId:String!): CurrentQuizItemResponse!
  playerAnswered(shortId:String!): AnswerResponse!
`;

export const gameQueries = `
  game(shortId:String!): Game!
`;

export const gameMutations = `
  createGame(name:String!): Game!
  deleteGame(shortId:String!): String!
  addPlayerToGame(shortId:String!, playerId:ID!): String!
  updateGameStage(shortId:String!, stage:String!): String!
  updateGameCurrentQuizItem(shortId:String!, currentQuizItem:CurrentQuizItem!): String!
  giveAnswer(shortId:String!, playerId:ID!, answer:String!): String!
`;
