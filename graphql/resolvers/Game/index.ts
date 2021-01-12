import { PubSub } from "graphql-subscriptions";
import Game from "../../../models/Game";

interface Name {
  name: string;
}
interface Id {
  id: string;
}

const pubsub = new PubSub();
const GAME_CREATED = "GAME_CREATED";

const resolvers = {
  Subscription: {
    gameCreated() {
      return pubsub.asyncIterator([GAME_CREATED]);
    },
  },
  Query: {
    async getGames() {
      try {
        return await Game.find();
      } catch (error) {
        throw error;
      }
    },
    async getGame({ id }: Id) {
      try {
        return Game.findById(id);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    async createGame({ name }: Name) {
      try {
        const game = new Game({
          name,
        });
        const newGame = await game.save();
        pubsub.publish(GAME_CREATED, { gameCreated: newGame });
        return newGame;
      } catch (error) {
        throw error;
      }
    },
    async deleteGame({ id }: Id) {
      try {
        return await Game.findOneAndDelete({ _id: id });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default {
  ...resolvers.Subscription,
  ...resolvers.Query,
  ...resolvers.Mutation,
};
