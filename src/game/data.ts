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