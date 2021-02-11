import { PubSub, withFilter } from "graphql-subscriptions";

import * as cryptoRandomString from "crypto-random-string";
import Game from "../../../models/Game";
import Quiz from "../../../models/Quiz";
import { ESubscriptions } from "../../../constants/Subscriptions.constants";
import getRandomQuizItemId from "../../../utils/getRandomQuizItemId.util";

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
  answerType: "duo" | "carre" | "cash";
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
          "players.player",
          {
            path: "currentState.question.quiz",
            populate: { path: "category" },
          },
          "currentPlayers",
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
        const randomQuizId = (
          await Quiz.aggregate([
            {
              $sample: { size: 1 },
            },
          ])
        )[0]._id;
        const game = new Game({
          shortId,
          name,
          currentQuizItem: {
            quizId: randomQuizId,
            level: "beginner",
            quizItemId: getRandomQuizItemId(),
          },
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
          { $addToSet: { players: { player: playerId, points: 0 } } },
          { new: true, useFindAndModify: false },
        ).populate("players.player");

        pubsub.publish(ESubscriptions.GAME_PLAYERS_UPDATED, {
          gamePlayersUpdated: updatedGame,
        });

        return `Player added to ${shortId}`;
      } catch (error) {
        throw error;
      }
    },
    updateGameStage: async (root, { shortId, stage }: ShortId & Stage) => {
      try {
        const updatedGame = await Game.findOneAndUpdate(
          { shortId },
          {
            $set: {
              stage,
              "currentQuizItem.createdAtTimestamp": Math.floor(
                Date.now() / 1000,
              ),
            },
          },
          { new: true, useFindAndModify: false, runValidators: true },
        ).populate("players.player");

        pubsub.publish(ESubscriptions.GAME_STAGE_UPDATED, {
          gameStageUpdated: updatedGame,
        });

        return `Stage of ${shortId} updated.`;
      } catch (error) {
        throw error;
      }
    },
    giveAnswer: async (
      root,
      { shortId, playerId, answer, answerType }: ShortId & PlayerId & Answer,
    ) => {
      try {
        pubsub.publish(ESubscriptions.PLAYER_ANSWERED, {
          playerAnswered: { shortId, playerId, answer, answerType },
        });

        return `Answer given from ${shortId} by ${playerId}.`;
      } catch (error) {
        throw error;
      }
    },
  },
};

export const { Subscription, Query, Mutation } = resolvers;
