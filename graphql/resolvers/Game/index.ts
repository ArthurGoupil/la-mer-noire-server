import Game from "../../../models/Game";

interface Name {
  name: string;
}
interface Id {
  id: string;
}

const resolvers = {
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
    async addGame({ name }: Name) {
      try {
        const game = new Game({
          name,
        });
        const newGame = await game.save();
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

export default { ...resolvers.Query, ...resolvers.Mutation };
