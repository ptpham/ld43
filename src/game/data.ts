
export type LocationTypeDataType = {
  targetSkill?: string
}

export type LocationType = 
  | "Start" 
  | "Finish" 
  | "Forest" 
  | "GoblinNest" 
  | "River"
  | "Swamp"
  | "BarbarianVillage"
  | "Canyon"
  | "Desert"
  | "Mountain"

export type SkillType = 
  | 'WoodCutter'
  | 'Builder'
  | 'Priest'

export const LocationTypeData: { [key in LocationType]: {
  targetSkill?: SkillType;
}} = {
  Start: {},
  Finish: {},
  Forest: { targetSkill: 'WoodCutter' },
  GoblinNest: {},
  River: {},
  Canyon: { targetSkill: 'Builder' },
  Desert: { targetSkill: 'Priest' },
  Mountain: {},
  Swamp: {},
  BarbarianVillage: {}
};

export const LocationTypeNames = Object.keys(LocationTypeData);

export type CardVocationType = 
  | "Builder"
  | "Storyteller"
  | "Stupid"
  | "Fighter"
  | "WoodCutter"
  | "Priest"
;

export type CardType = {
  skill: CardVocationType;
  meat: number;
}
