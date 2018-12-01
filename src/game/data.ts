
export type LocationTypeDataType = {
  targetSkill?: string
}

export type LocationType = 
  | "Start" 
  | "Finish" 
  | "Forest" 
  | "GoblinNest" 
  | "Canyon"
  | "Desert"
  | "River"
  | "Mountain"

export type SkillType = 
  | 'Woodcutter'
  | 'Builder'
  | 'Priest'

export const LocationTypeData: { [key in LocationType]: {
  targetSkill?: SkillType;
}} = {
  Start: {},
  Finish: {},
  Forest: { targetSkill: 'Woodcutter' },
  GoblinNest: {},
  Canyon: { targetSkill: 'Builder' },
  Desert: { targetSkill: 'Priest' },
  River: {},
  Mountain: {}
};

export const LocationTypeNames = Object.keys(LocationTypeData);

export type CardVocationType = 
  | "Builder"
  | "Storyteller"
  | "Stupid"
  | "Fighter"
  | "Woodcutter"
  | "Priest"
;

export type CardType = {
  type: CardVocationType;
  meat: number;
  skill: number;
}
