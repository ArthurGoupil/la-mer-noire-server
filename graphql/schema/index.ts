const { buildSchema } = require("graphql");

export default buildSchema(`
  type Game {
    _id: ID!
    name: String!
    createdAt: String!
  }

  type Query {
    getGames:[Game!]
    getGame:Game!
  }

  type Mutation {
    addGame(name:String): Game
    deleteGame(id:ID): Game
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
