import { State } from "./state";
import { IEntity } from "./entity";
import * as Animations from './animations';
import { Point } from './lib/point';

/**
 * State for idol is on state.idolState.
 */
export class Idol extends PIXI.Sprite implements IEntity {
  constructor() {
    super(
      PIXI.loader.resources['test'].texture
    );
  }

  update(state: State): void {
  }
}
