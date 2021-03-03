export const gameTypes = `
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    stage: String!
    players: [GamePlayer]!
    currentPlayers: [Player]!
    currentQuizItem: CurrentQuizItem!
    createdAt: String!
  }
  type Stage {
    stage: String!
  }
  type GamePlayer {
    player: Player!
    points: Int!
  }
  type CurrentQuizItem {
    quizId: ID
    level: String
    quizItemId: Int
  }
  type Answer {
    playerId: ID!
    quizItemSignature: String!
    answer: String!
    answerType: String!
  }
`;

export const gameSubscriptions = `
  gamePlayersUpdated(shortId:String!): Game!
  gameStageUpdated(shortId:String!): Game!
  playerAnswered(shortId:String!): Answer!
  currentQuizItemUpdated(shortId:String!): Game!
`;

export const gameQueries = `
  game(shortId:String!): Game!
`;

export const gameMutations = `
  createGame(name:String!): Game!
  deleteGame(shortId:String!): String!
  addPlayerToGame(shortId:String!, name:String!): ID!
  updateGameStage(shortId:String!, stage:String!): String!
  giveAnswer(shortId:String!, playerId:ID!, quizItemSignature:String!, answer:String!, answerType: String!): String!
  generateNewCurrentQuizItem(shortId:String!, level:String!): String!
`;
