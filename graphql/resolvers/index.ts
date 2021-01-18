import {
  Subscription as gameSubscriptions,
  Query as gameQueries,
  Mutation as gameMutations,
} from "./Game";
import { Query as playerQueries, Mutation as playerMutations } from "./Player";
import { Query as quizQueries, Mutation as quizMutations } from "./Quiz";
import {
  Query as categoryQueries,
  Mutation as categoryMutations,
} from "./Category";

export default {
  Subscription: {
    ...gameSubscriptions,
  },
  Query: {
    ...gameQueries,
    ...playerQueries,
    ...quizQueries,
    ...categoryQueries,
  },
  Mutation: {
    ...gameMutations,
    ...playerMutations,
    ...quizMutations,
    ...categoryMutations,
  },
};
