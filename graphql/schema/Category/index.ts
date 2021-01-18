export const categoryTypes = `
  type Category {
    _id: ID!
    name: String!
    createdAt: String!
  }
`;

export const categoryQueries = `
  getCategories: [Category!]
  getCategory(id:ID): Category!
  getRandomCategory: Category!
`;

export const categoryMutations = `
  createCategory(name:String): Category!
  deleteCategory(id:ID): Category!
`;
