export const playerTypes = `
  type Player {
    _id: ID!
    name: String!
    createdAt: String!
  }
`;

export const playerQueries = `
  getPlayers: [Player!]
  getPlayer(id:ID!): Player!
`;

export const playerMutations = `
  createPlayer(name:String): Player!
  deletePlayer(id:ID): Player!
`;
