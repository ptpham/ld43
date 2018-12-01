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

export const CardTypes: CardType[] = [
  {
    type: "Builder",
    meat: 3,
    skill: 7,
  },
  {
    type: "Storyteller",
    meat: 7,
    skill: 2,
  },
  {
    type: "Fighter",
    meat: 1,
    skill: 1,
  },
  {
    type: "Stupid",
    meat: 1,
    skill: 9,
  },
]