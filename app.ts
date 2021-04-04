import * as express from "express";
import { connect } from "mongoose";
import { ApolloServer, gql } from "apollo-server-express";
import { createServer } from "http";

import graphqlSchema from "./graphql/schema";
import resolvers from "./graphql/resolvers";

require("events").defaultMaxListeners = 30;

connect(process.env.MONGO_DB_URL, {
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

ws.listen({ port: process.env.PORT || 4000 }, () => {
  console.log(`GraphQL server is running...`);
  console.log(`Subscriptions server is running...`);
});
