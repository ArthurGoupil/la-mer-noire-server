import { PubSub, withFilter } from "graphql-subscriptions";
import * as cryptoRandomString from "crypto-random-string";
import { ApolloError } from "apollo-server-express";

import Game, { PlayerData } from "../../../models/Game";
import {
  Answer,
  Name,
  PlayerId,
  ShortId,
  Stage,
} from "../../../models/utils/Commons";
import Quiz, { QuizLevel } from "../../../models/Quiz";
import PlayerModel from "../../../models/Player";
import { ESubscriptions } from "../../../constants/Subscriptions.constants";
import getRandomQuizItemId from "../../../utils/getRandomQuizItemId.util";

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
        (payload, variables) =>
          payload.gameStageUpdated.shortId === variables.shortId,
      ),
    },
    playerAnswered: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.PLAYER_ANSWERED]),
        (payload, variables) =>
          payload.playerAnswered.shortId === variables.shortId,
      ),
    },
    currentQuizItemUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ESubscriptions.CURRENT_QUIZ_ITEM_UPDATED]),
        (payload, variables) =>
          payload.currentQuizItemUpdated.shortId === variables.shortId,
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
        throw new ApolloError(error.message, error.extensions.code);
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
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
    deleteGame: async (root, { shortId }: ShortId) => {
      try {
        await Game.findOneAndDelete({ shortId });

        return `Game ${shortId} deleted.`;
      } catch (error) {
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
    addPlayerToGame: async (root, { shortId, name }: ShortId & Name) => {
      try {
        const game = await Game.findOne({ shortId }).populate("players.player");
        game.players.forEach((playerData: PlayerData) => {
          if (playerData.player.name.trim() === name.trim()) {
            throw new ApolloError(
              "Ce nom est déjà utilisé dans cette partie.",
              "NAME_DUPLICATE",
            );
          }
        });

        const player = new PlayerModel({
          name,
        });
        const newPlayer = await player.save();

        game.players.push({
          player: newPlayer,
          points: 0,
        });
        await game.save();

        pubsub.publish(ESubscriptions.GAME_PLAYERS_UPDATED, {
          gamePlayersUpdated: game,
        });

        return newPlayer._id;
      } catch (error) {
        throw new ApolloError(error.message, error.extensions.code);
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
        throw new ApolloError(error.message, error.extensions.code);
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
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
    generateNewCurrentQuizItem: async (
      root,
      { shortId, level }: ShortId & QuizLevel,
    ) => {
      try {
        const randomQuizId = (
          await Quiz.aggregate([
            {
              $sample: { size: 1 },
            },
          ])
        )[0]._id;
        const updatedGame = await Game.findOneAndUpdate(
          { shortId },
          {
            $set: {
              currentQuizItem: {
                quizId: randomQuizId,
                level,
                quizItemId: getRandomQuizItemId(),
                createdAtTimestamp: Math.floor(Date.now() / 1000),
              },
            },
          },
          { new: true, useFindAndModify: false, runValidators: true },
        ).populate("players.player");

        pubsub.publish(ESubscriptions.CURRENT_QUIZ_ITEM_UPDATED, {
          currentQuizItemUpdated: updatedGame,
        });

        return `CurrentQuizItem of ${shortId} updated.`;
      } catch (error) {
        throw new ApolloError(error.message, error.extensions.code);
      }
    },
  },
};

export const { Subscription, Query, Mutation } = resolvers;
