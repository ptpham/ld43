
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
  | "Architect"
  | "Assassin"
  | "Bard" // aka Storyteller.
  | "Cartographer"
  | "Priest"
  | "Woodsman" // Woodcutting, but also general forestry.
  // We do not have assets for those below this line.
  | "Merchant"
  | "Sage" // Knows many things but can't do much.
  | "Swordswoman"
  | "Wizard"
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
