
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
  | "Sage" // Knows many things but can't do much.
  | "Merchant"
  | "Fool"
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
