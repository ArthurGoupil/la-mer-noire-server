import Player from "../../../models/Player";

interface Name {
  name: string;
}
interface Id {
  id: string;
}

const resolvers = {
  Query: {
    getPlayers: async () => {
      try {
        return await Player.find();
      } catch (error) {
        throw error;
      }
    },
    getPlayer: async (root, { id }: Id) => {
      try {
        return Player.findById(id);
      } catch (error) {
        throw error;
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
        throw error;
      }
    },
    deletePlayer: async (root, { id }: Id) => {
      try {
        return await Player.findOneAndDelete({ _id: id });
      } catch (error) {
        throw error;
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
