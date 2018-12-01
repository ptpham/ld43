const LocationTypes = {
  Start: true,
  Finish: true,
  Forest: true,
  Forest2: true,
  GoblinNest: true,
  Desert: true,
  River: true,
  Mountain: true
};

export type LocationType = keyof typeof LocationTypes;
export const LocationTypeNames = Object.keys(LocationTypes);

export type CardVocationType = 
  | "Builder"
  | "Storyteller"
  | "Stupid"
  | "Fighter"
;

export type CardType = {
  type: CardVocationType;
  meat: number;
  skill: number;
}
