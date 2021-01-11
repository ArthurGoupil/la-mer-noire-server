import * as express from "express";
import graphqlSchema from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { graphqlHTTP } from "express-graphql";
import * as cors from "cors";
import { connect } from "mongoose";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

connect("mongodb://localhost/la-mer-noire", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: resolvers,
    graphiql: true,
  }),
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log(socket.id);
});

httpServer.listen(process.env.PORT || 4000, () => {
  console.log("Server has started.");
});
