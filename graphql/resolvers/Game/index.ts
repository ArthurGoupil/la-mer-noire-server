import { PubSub, withFilter } from "graphql-subscriptions";

import * as cryptoRandomString from "crypto-random-string";
import Game from "../../../models/Game";
import { ESubscriptions } from "../../Constants/Subscriptions.constants";

interface Name {
  name: string;
}
interface ShortId {
  shortId: string;
}

interface PlayerId {
  playerId: string;
}

interface CurrentState {
  currentState: {
    stage: string;
    question: {
      quiz: string;
      level: string;
      itemId: number;
    };
    playersTurn: string[];
  };
}

interface Answer {
  answer: string;
}

const pubsub = new PubSub();

const resolvers = {
  Subscription: {
    gameCreated: {
      subscribe: () => pubsub.asyncIterator([ESubscriptions.GAME_CREATED]),
    },
    gameCurrentStateChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.GAME_CURRENT_STATE_CHANGED]),
        (payload, variables) =>
          payload.gameCurrentStateChanged.shortId === variables.shortId,
      ),
    },
    gamePlayersChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.GAME_PLAYERS_CHANGED]),
        (payload, variables) =>
          payload.gamePlayersChanged.shortId === variables.shortId,
      ),
    },
    playerAnswered: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.PLAYER_ANSWERED]),
        (payload, variables) =>
          payload.playerAnswered.shortId === variables.shortId,
      ),
    },
  },

  Query: {
    getGames: async () => {
      try {
        return await Game.find();
      } catch (error) {
        throw error;
      }
    },
    getGame: async (root, { shortId }: ShortId) => {
      try {
        return Game.findOne({ shortId }).populate([
          "players",
          {
            path: "currentState.question.quiz",
            populate: { path: "category" },
          },
          "currentState.playersTurn",
        ]);
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
        pubsub.publish(ESubscriptions.GAME_CREATED, { gameCreated: newGame });
        return newGame;
      } catch (error) {
        throw error;
      }
    },
    updateGameCurrentState: async (
      root,
      { currentState, shortId }: CurrentState & ShortId,
    ) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { shortId },
          { $set: { currentState } },
          { new: true, useFindAndModify: false },
        ).populate([
          "players",
          {
            path: "currentState.question.quiz",
            populate: { path: "category" },
          },
          "currentState.playersTurn",
        ]);
        pubsub.publish(ESubscriptions.GAME_CURRENT_STATE_CHANGED, {
          gameCurrentStateChanged: updatedGame,
        });

        return updatedGame;
      } catch (error) {
        throw error;
      }
    },
    addPlayerToGame: async (
      root,
      { playerId, shortId }: PlayerId & ShortId,
    ) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { shortId },
          { $addToSet: { players: playerId } },
          { new: true, useFindAndModify: false },
        ).populate("players");
        pubsub.publish(ESubscriptions.GAME_PLAYERS_CHANGED, {
          gamePlayersChanged: updatedGame,
        });

        return updatedGame;
      } catch (error) {
        throw error;
      }
    },
    deleteGame: async (root, { shortId }: ShortId) => {
      try {
        return await Game.findOneAndDelete({ shortId });
      } catch (error) {
        throw error;
      }
    },
    giveAnswer: async (
      root,
      { shortId, playerId, answer }: ShortId & PlayerId & Answer,
    ) => {
      const AnswerResponse = { playerId, answer };
      pubsub.publish(ESubscriptions.PLAYER_ANSWERED, {
        playerAnswered: { ...AnswerResponse, shortId },
      });

      return AnswerResponse;
    },
  },
};

export const { Subscription, Query, Mutation } = resolvers;
