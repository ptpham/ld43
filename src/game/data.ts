
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
  | 'Assassin'

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
  | "Stupid" // the most important one.
  | "Architect"
  | "Assassin"
  | "Bard" // aka Storyteller.
  | "Child"
  | "Dancer"
  | "Fisherman" // Good with boats and water
  | "Historian"
  | "Merchant"
  | "Sage" // Knows many things but can't do much.
  | "Swordswoman"
  | "Priest"
  | "Wizard"
  | "Woodsman" // Woodcutting, but also general forestry.
;

export type CardType = {
  skill: CardVocationType;
  meat: number;
}
