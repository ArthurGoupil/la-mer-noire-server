export const gameTypes = `
  type Question {
    quiz: Quiz
    level: String
    itemId: Int
  }
  type CurrentState {
    stage: String!
    question: Question
    playersTurn: [Player]!
  }
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    players: [Player]!
    currentState: CurrentState!
    createdAt: String!
  }
  type AnswerResponse {
    playerId: ID!
    answer: String!
  }
`;

export const gameInputs = `  
input QuestionInput {
  quiz: ID!
  level: String!
  itemId: Int!
}
input CurrentStateInput {
    stage: String!
    question: QuestionInput
    playersTurn: [ID]
  }
`;

export const gameSubscriptions = `
  gameCreated: Game!
  gameCurrentStateChanged(shortId:String!): Game!
  gamePlayersChanged(shortId:String!): Game!
  playerAnswered(shortId:String!): AnswerResponse!
`;

export const gameQueries = `
  getGames: [Game!]
  getGame(shortId:String!): Game!
`;

export const gameMutations = `
  createGame(name:String!): Game!
  updateGameCurrentState(currentState:CurrentStateInput!, shortId:String!): Game!
  addPlayerToGame(playerId:ID!, shortId:String!): Game!
  deleteGame(shortId:String!): Game!
  giveAnswer(shortId:String!, playerId:ID!, answer: String!): AnswerResponse!
`;
