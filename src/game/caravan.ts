import { State } from "./state";
import { IEntity } from "./entity";

/**
 * If you want to update the node of the caravan, use state.caravan_location
 */
export class Caravan extends PIXI.Sprite implements IEntity {
  constructor() {
    super(
      PIXI.loader.resources['caravan'].texture
    );
  }

  update(state: State): void {
    this.x = state.caravan_location.position.x;
    this.y = state.caravan_location.position.y;
  }
}