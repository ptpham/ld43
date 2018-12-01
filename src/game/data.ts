

const LocationTypes = {
  Start: true,
  Finish: true,
  Forest: true,
  Forest2: true,
  GoblinNest: true,
  Desert: true,
  River: true,
  Mountai: truen
}


export const enum LocationType {
  Start,
  Finish,
  Forest,
  Forest2,
  GoblinNest,
  Desert,
  River,
  Mountain
}

export type CardVocationType = 
  | "Builder"
  | "Storyteller"
  | "Stupid"
  | "Fighter"
;

export type CardType = {
  type: CardVocationType;
  meat: number;

}

export const CardTypes: CardType[] = [

]