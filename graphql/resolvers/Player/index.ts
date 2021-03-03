import { ApolloError } from "apollo-server-express";
import Player from "../../../models/Player";
import { Id, Name } from "../../../models/utils/Commons";

const resolvers = {
  Query: {
    getPlayers: async () => {
      try {
        return await Player.find();
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    getPlayer: async (root, { id }: Id) => {
      try {
        return Player.findById(id);
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
  Mutation: {
    createPlayer: async (root, { name }: Name) => {
      try {
        const player = new Player({
          name,
        });
        const newPlayer = await player.save();
        return newPlayer;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    deletePlayer: async (root, { id }: Id) => {
      try {
        return await Player.findOneAndDelete({ _id: id });
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
