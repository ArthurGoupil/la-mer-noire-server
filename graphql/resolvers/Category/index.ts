import Category from "../../../models/Category";

interface Name {
  name: string;
}
interface Id {
  id: string;
}

const resolvers = {
  Query: {
    getCategories: async () => {
      try {
        return await Category.find();
      } catch (error) {
        throw error;
      }
    },
    getCategory: async (root, { id }: Id) => {
      try {
        return await Category.findById(id);
      } catch (error) {
        throw error;
      }
    },
    getRandomCategory: async () => {
      try {
        return (await Category.aggregate([{ $sample: { size: 1 } }]))[0];
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createCategory: async (root, { name }: Name) => {
      try {
        const newCategory = new Category({ name });
        return await newCategory.save();
      } catch (error) {
        throw error;
      }
    },
    deleteCategory: async (root, { id }: Id) => {
      try {
        return await Category.findOneAndDelete({ _id: id });
      } catch (error) {
        throw error;
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
