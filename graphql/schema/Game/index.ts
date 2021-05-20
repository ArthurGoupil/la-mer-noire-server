export const gameTypes = `
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    stage: String!
    players: [GamePlayer]!
    currentQuizItem: CurrentQuizItem!
    scubadoobidooQuizItemSignatures: [ScubadoobidooQuizItemSignatures]!
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
    currentPlayers: [ID]
    playersCanAnswer: Boolean
    playersCanBuzz: Boolean
  }
  type Answer {
    playerId: ID!
    quizItemSignature: String!
    answer: String!
    answerType: String!
  }
  type ScubadoobidooQuizItemSignatures {
    quizId: ID
    level: String
    quizItemId: Int
  }
  type ScubadoobidooQuizItemData {
    quizItemId: Int!
    question: String!
    choices: [String]!
    answer: String!
    anecdote: String
    level: String!
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
  scubadoobidooQuizItems(shortId:String!): [ScubadoobidooQuizItemData]!
`;

export const gameMutations = `
  createGame(name:String!): Game!
  deleteGame(shortId:String!): String!
  addPlayerToGame(shortId:String!, name:String!): ID!
  updateGameStage(shortId:String!, stage:String!): String!
  giveAnswer(shortId:String!, playerId:ID!, quizItemSignature:String!, answer:String!, answerType: String!): String!
  generateNewCurrentQuizItem(shortId:String!, level:String!): String!
  updatePlayersCanAnswer(shortId:String!, playersCanAnswer:Boolean!): String!
  updatePlayersCanBuzz(shortId:String!, playersCanBuzz:Boolean!): String!
  updateCurrentPlayers(shortId:String!, currentPlayers:[ID]!): String!
`;
