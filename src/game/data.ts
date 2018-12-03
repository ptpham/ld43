
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

export const SkillTypeData: { [key in SkillType]: boolean } = {
  "Architect": true,
  "Assassin": true,
  "Bard": true,
  "Cartographer": true,
  "Priest": true,
  "Woodsman": true,
  "Sage": true,
  "Merchant": true,
  "Fool": true
};

export const LocationTypeNames = Object.keys(LocationTypeData);
export const SkillTypeNames = Object.keys(SkillTypeData);

export type CardType = {
  skill: SkillType;
  meat: number;
}

export const CardToAsset = new Map([
  ['Priest', '/assets/priest.png'],
  ['Woodsman', '/assets/woodcutter.png'],
  ['Architect', '/assets/builder.png'],
  ['Assassin', '/assets/assassin.png'],
  ['Cartographer', '/assets/cartographer.png'],
  ['Sage', '/assets/sage.png'],
  ['Merchant', '/assets/merchant.png'],
  ['Bard', '/assets/bard.png'],
  ['Fool', '/assets/fool.png']
]);
