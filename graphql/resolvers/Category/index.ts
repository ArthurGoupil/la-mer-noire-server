import { ApolloError } from "apollo-server-express";
import Category from "../../../models/Category";
import { Id, Name } from "../../../models/utils/Commons";

const resolvers = {
  Query: {
    getCategories: async () => {
      try {
        return await Category.find();
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    getCategory: async (root, { id }: Id) => {
      try {
        return await Category.findById(id);
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    getRandomCategory: async () => {
      try {
        return (await Category.aggregate([{ $sample: { size: 1 } }]))[0];
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
  Mutation: {
    createCategory: async (root, { name }: Name) => {
      try {
        const newCategory = new Category({ name });
        return await newCategory.save();
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    deleteCategory: async (root, { id }: Id) => {
      try {
        return await Category.findOneAndDelete({ _id: id });
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};

export const { Query, Mutation } = resolvers;
