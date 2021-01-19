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
const GAME_PLAYERS_CHANGED = "GAME_PLAYERS_CHANGED";

const resolvers = {
  Subscription: {
    gameCreated: {
      subscribe: () => pubsub.asyncIterator([GAME_CREATED]),
    },
    gameCurrentStateChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([GAME_CURRENT_STATE_CHANGED]),
        (payload, variables) =>
          payload.gameCurrentStateChanged._id.toString() === variables.gameId,
      ),
    },
    gamePlayersChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([GAME_PLAYERS_CHANGED]),
        (payload, variables) =>
          payload.gamePlayersChanged._id.toString() === variables.gameId,
      ),
    },
  },

  Query: {
    getGames: async () => {
      try {
        return await Game.find().populate("players");
      } catch (error) {
        throw error;
      }
    },
    getGame: async (root, { id }: Id) => {
      try {
        return Game.findById(id).populate("players");
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
        }).populate("players");
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
        ).populate("players");
        pubsub.publish(GAME_CURRENT_STATE_CHANGED, {
          gameCurrentStateChanged: updatedGame,
        });

        return updatedGame;
      } catch (error) {
        throw error;
      }
    },
    addPlayerToGame: async (root, { playerId, gameId }) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { _id: gameId },
          { $addToSet: { players: playerId } },
          { new: true, useFindAndModify: false },
        ).populate("players");
        pubsub.publish(GAME_PLAYERS_CHANGED, {
          gamePlayersChanged: updatedGame,
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
