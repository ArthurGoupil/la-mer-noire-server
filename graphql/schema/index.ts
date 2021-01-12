import { buildSchema } from "graphql";

export default buildSchema(`
  type Game {
    _id: ID!
    name: String!
    players: [ID]
    createdAt: String!
  }

  type Player {
    _id: ID!
    name: String!
    createdAt: String!
  }

  type Subscription {
    gameCreated: Game
  }

  type Query {
    getGames:[Game!]
    getGame:Game!
    getPlayers:[Player!]
    getPlayer:Player!
  }

  type Mutation {
    createGame(name:String): Game
    deleteGame(id:ID): Game
    createPlayer(name:String): Player
    deletePlayer(id:ID): Player
  }

  schema {
    subscription: Subscription
    query: Query
    mutation: Mutation
  }
`);
