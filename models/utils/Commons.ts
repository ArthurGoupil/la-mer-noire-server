import { EGameStage } from "../../constants/GameStage.constants";

export interface Id {
  id: string;
}

export interface Name {
  name: string;
}
export interface ShortId {
  shortId: string;
}

export interface PlayerId {
  playerId: string;
}

export interface Stage {
  stage: EGameStage;
}

export interface Answer {
  answer: string;
  answerType: "duo" | "carre" | "cash";
}
