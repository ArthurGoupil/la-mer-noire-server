export const gameTypes = `
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    stage: String!
    players: [Player]!
    currentPlayers: [Player]!
    currentQuizItem: CurrentQuizItem
    createdAt: String!
  }
  type Stage {
    stage: String!
  }
  type CurrentQuizItem {
    quizId: ID
    level: String
    quizItemId: Int
  }
  type Answer {
    playerId: ID!
    answer: String!
  }
`;

export const gameInputs = `
  input CurrentQuizItemInput {
    quizId: ID!
    level: String!
    quizItemId: Int!
  }
`;

export const gameSubscriptions = `
  gamePlayersUpdated(shortId:String!): Game!
  gameStageUpdated(shortId:String!): Game!
  gameCurrentQuizItemUpdated(shortId:String!): Game!
  playerAnswered(shortId:String!): Answer!
`;

export const gameQueries = `
  game(shortId:String!): Game!
`;

export const gameMutations = `
  createGame(name:String!): Game!
  deleteGame(shortId:String!): String!
  addPlayerToGame(shortId:String!, playerId:ID!): String!
  updateGameStage(shortId:String!, stage:String!): String!
  updateGameCurrentQuizItem(shortId:String!, currentQuizItem:CurrentQuizItemInput!): String!
  giveAnswer(shortId:String!, playerId:ID!, answer:String!): String!
`;
