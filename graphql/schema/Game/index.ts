export const gameTypes = `
  type CurrentState {
    type: String!
    _id: ID
  }
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    players: [Player]!
    currentState: CurrentState!
    createdAt: String!
  }
`;

export const gameInputs = `
  input CurrentStateInput {
    type: String!
    _id: ID
  }
`;

export const gameSubscriptions = `
  gameCreated: Game!
  gameCurrentStateChanged(shortId:String!): Game!
  gamePlayersChanged(shortId:String!): Game!
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
`;
