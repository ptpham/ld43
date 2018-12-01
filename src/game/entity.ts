import { State } from "./main";

/* 
 * Extend me pls! 
 */
export class Entity {
  public update(state: State): void {

  }
}

export interface IEntity {
  update: (state: State) => void;
}