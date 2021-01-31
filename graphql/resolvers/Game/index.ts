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

interface Stage {
  stage: string;
}

interface Answer {
  answer: string;
}

interface CurrentQuizItem {
  currentQuizItem: {
    quizId: string;
    level: "beginner" | "intermediate" | "expert";
    quizItemId: number;
  };
}

const pubsub = new PubSub();

const resolvers = {
  Subscription: {
    gamePlayersUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.GAME_PLAYERS_UPDATED]),
        (payload, variables) =>
          payload.gamePlayersUpdated.shortId === variables.shortId,
      ),
    },
    gameStageUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.GAME_STAGE_UPDATED]),
        (payload, variables) => {
          return payload.gameStageUpdated.shortId === variables.shortId;
        },
      ),
    },
    gameCurrentQuizItemUpdated: {
      subscribe: withFilter(
        () =>
          pubsub.asyncIterator([ESubscriptions.GAME_CURRENT_QUIZ_ITEM_UPDATED]),
        (payload, variables) => {
          return (
            payload.gameCurrentQuizItemUpdated.shortId === variables.shortId
          );
        },
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
    game: async (root, { shortId }: ShortId) => {
      try {
        return Game.findOne({ shortId }).populate([
          "players",
          {
            path: "currentState.question.quiz",
            populate: { path: "category" },
          },
          "currentState.currentPlayers",
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
          shortId,
          name,
        });
        const newGame = await game.save();
        pubsub.publish(ESubscriptions.GAME_CREATED, { gameCreated: newGame });
        return newGame;
      } catch (error) {
        throw error;
      }
    },
    deleteGame: async (root, { shortId }: ShortId) => {
      try {
        await Game.findOneAndDelete({ shortId });

        return `Game ${shortId} deleted.`;
      } catch (error) {
        throw error;
      }
    },
    addPlayerToGame: async (
      root,
      { shortId, playerId }: ShortId & PlayerId,
    ) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { shortId },
          { $addToSet: { players: playerId } },
          { new: true, useFindAndModify: false },
        ).populate("players");
        pubsub.publish(ESubscriptions.GAME_PLAYERS_UPDATED, {
          gamePlayersUpdated: updatedGame,
        });

        return `Player added to ${shortId}`;
      } catch (error) {
        throw error;
      }
    },
    updateGameStage: async (root, { shortId, stage }: ShortId & Stage) => {
      pubsub.publish(ESubscriptions.GAME_STAGE_UPDATED, {
        gameStageUpdated: { shortId, stage },
      });

      return `Stage of ${shortId} updated.`;
    },
    updateGameCurrentQuizItem: async (
      root,
      { shortId, currentQuizItem }: ShortId & CurrentQuizItem,
    ) => {
      pubsub.publish(ESubscriptions.GAME_CURRENT_QUIZ_ITEM_UPDATED, {
        gameCurrentQuizItemUpdated: { shortId, ...currentQuizItem },
      });

      return `CurrentQuizItem of ${shortId} updated.`;
    },
    giveAnswer: async (
      root,
      { shortId, playerId, answer }: ShortId & PlayerId & Answer,
    ) => {
      pubsub.publish(ESubscriptions.PLAYER_ANSWERED, {
        playerAnswered: { shortId, playerId, answer },
      });

      return `Answer given from ${shortId} by ${playerId}.`;
    },
  },
};

export const { Subscription, Query, Mutation } = resolvers;
