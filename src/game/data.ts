
export const LocationTypeData = {
  Start: {},
  Finish: {},
  Forest: { targetSkill: 'Forester' },
  GoblinNest: {},
  Canyon: { targetSkill: 'Builder' },
  Desert: { targetSkill: 'Priest' },
  River: {},
  Mountain: {}
};

export type LocationType = keyof typeof LocationTypeData;
export const LocationTypeNames = Object.keys(LocationTypeData);

export type CardVocationType = 
  | "Builder"
  | "Storyteller"
  | "Stupid"
  | "Fighter"
  | "Forester"
  | "Priest"
;

export type CardType = {
  type: CardVocationType;
  meat: number;
  skill: number;
}
