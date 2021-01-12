import Player from "../../../models/Player";

interface Name {
  name: string;
}
interface Id {
  id: string;
}

const resolvers = {
  Query: {
    async getPlayers() {
      try {
        return await Player.find();
      } catch (error) {
        throw error;
      }
    },
    async getPlayer({ id }: Id) {
      try {
        return Player.findById(id);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    async createPlayer({ name }: Name) {
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
    async deletePlayer({ id }: Id) {
      try {
        return await Player.findOneAndDelete({ _id: id });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default { ...resolvers.Query, ...resolvers.Mutation };
