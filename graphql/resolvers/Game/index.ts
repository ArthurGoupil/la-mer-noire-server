import { PubSub, withFilter } from "graphql-subscriptions";

import * as cryptoRandomString from "crypto-random-string";
import Game from "../../../models/Game";

interface Name {
  name: string;
}
interface Id {
  id: string;
}
interface CurrentStateAndId {
  currentState: {
    type: string;
    _id?: string;
  };
  gameId: string;
}

const pubsub = new PubSub();
const GAME_CREATED = "GAME_CREATED";
const GAME_CURRENT_STATE_CHANGED = "GAME_CURRENT_STATE_CHANGED";

const resolvers = {
  Subscription: {
    gameCreated: {
      subscribe: () => pubsub.asyncIterator([GAME_CREATED]),
    },
    gameCurrentStateChanged: withFilter(
      () => pubsub.asyncIterator([GAME_CURRENT_STATE_CHANGED]),
      (payload, variables) => {
        console.log(variables);
        // console.log(context.fieldNodes[0].arguments);

        return true;
      },
    ),
  },

  Query: {
    getGames: async () => {
      try {
        return await Game.find();
      } catch (error) {
        throw error;
      }
    },
    getGame: async (root, { id }: Id) => {
      try {
        return Game.findById(id);
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    createGame: async (root, { name }: Name) => {
      try {
        const shortId = cryptoRandomString({ length: 5 }).toUpperCase();
        const game = new Game({
          name,
          shortId,
        });
        const newGame = await game.save();
        pubsub.publish(GAME_CREATED, { gameCreated: newGame });
        return newGame;
      } catch (error) {
        throw error;
      }
    },
    updateGameCurrentState: async (
      root,
      { currentState, gameId }: CurrentStateAndId,
    ) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { _id: gameId },
          { $set: { currentState } },
          { new: true, useFindAndModify: false },
        );
        pubsub.publish(GAME_CURRENT_STATE_CHANGED, {
          gameCurrentStateChanged: updatedGame,
        });

        return updatedGame;
      } catch (error) {
        throw error;
      }
    },
    deleteGame: async (root, { id }: Id) => {
      try {
        return await Game.findOneAndDelete({ _id: id });
      } catch (error) {
        throw error;
      }
    },
  },
};

export const { Subscription, Query, Mutation } = resolvers;
