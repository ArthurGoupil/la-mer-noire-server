export const gameTypes = `
  type CurrentState {
    type: String!
    _id: ID
  }
  type Game {
    _id: ID!
    shortId: String!
    name: String!
    players: [ID]!
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
  gameCurrentStateChanged(gameId:ID): Game!
`;

export const gameQueries = `
  getGames: [Game!]
  getGame(id:ID): Game!
`;

export const gameMutations = `
  createGame(name:String): Game!
  updateGameCurrentState(currentState:CurrentStateInput!, gameId:ID): Game!
  deleteGame(id:ID): Game!
`;
