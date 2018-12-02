
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

export const LocationTypeData: { [key in LocationType]: {
  targetSkill?: SkillType;
}} = {
  Start: {},
  Finish: {},
  Forest: { targetSkill: 'Woodsman' },
  GoblinNest: {},
  River: {},
  Canyon: { targetSkill: 'Architect' },
  Desert: { targetSkill: 'Priest' },
  Mountain: {},
  Swamp: {},
  BarbarianVillage: {}
};

export const LocationTypeNames = Object.keys(LocationTypeData);

export type CardType = {
  skill: SkillType;
  meat: number;
}
