import * as express from "express";
import { connect } from "mongoose";
import { ApolloServer, gql } from "apollo-server-express";
import { createServer } from "http";

import graphqlSchema from "./graphql/schema";
import resolvers from "./graphql/resolvers";

connect("mongodb://localhost/la-mer-noire", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const apollo = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers,
});

const app = express();
apollo.applyMiddleware({ app });

const ws = createServer(app);
apollo.installSubscriptionHandlers(ws);

ws.listen({ port: 4000 }, () => {
  console.log(`GraphQL server running at : http://localhost:4000/graphql`);
  console.log(`Subscriptions server running at : ws://localhost:4000/graphql`);
});
