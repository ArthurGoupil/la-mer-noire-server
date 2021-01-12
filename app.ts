import * as express from "express";
import { connect } from "mongoose";
import { execute, subscribe } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import graphqlSchema from "./graphql/schema";
import resolvers from "./graphql/resolvers";

connect("mongodb://localhost/la-mer-noire", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();
const apolloServer = new ApolloServer({
  schema: graphqlSchema,
  rootValue: resolvers,
});
apolloServer.applyMiddleware({ app });

const server = createServer(app);

server.listen(process.env.PORT || 4000, () => {
  console.log("Server has started.");
  const serverf = new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: graphqlSchema,
      rootValue: resolvers,
    },
    {
      server: server,
      path: "/subscriptions",
    },
  );
});
