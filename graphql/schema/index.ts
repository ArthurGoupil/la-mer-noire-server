import { gql } from "apollo-server-express";
import {
  gameTypes,
  gameInputs,
  gameSubscriptions,
  gameQueries,
  gameMutations,
} from "./Game";
import { playerTypes, playerQueries, playerMutations } from "./Player";
import { quizTypes, quizInputs, quizQueries, quizMutations } from "./Quiz";
import { categoryTypes, categoryQueries, categoryMutations } from "./Category";

export default gql`
  ${gameTypes}
  ${playerTypes}
  ${quizTypes}
  ${categoryTypes}
  
  ${quizInputs}
  ${gameInputs}

  type Subscription {
    ${gameSubscriptions}
  }

  type Query {
    ${gameQueries}
    ${playerQueries}
    ${quizQueries}
    ${categoryQueries}
  }

  type Mutation {
    ${gameMutations}
    ${playerMutations}
    ${quizMutations}
    ${categoryMutations}
  }
`;
