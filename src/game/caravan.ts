import { State } from "./state";
import { IEntity } from "./entity";
import * as Animations from './animations';
import { Point } from './lib/point';

/**
 * If you want to update the node of the caravan, use state.caravan_location
 */
export class Caravan extends PIXI.Sprite implements IEntity {
  idol: PIXI.Sprite;

  constructor() {
    super(
      PIXI.loader.resources['caravan'].texture
    );
    this.idol = new PIXI.Sprite(PIXI.loader.resources['idol'].texture);
    this.idol.y = -12;
  }

  update(state: State): void {
    let start = new Point(this.x, this.y);
    let { caravanLocation, idolState } = state;

    if (state.walkAnimation == null && start.distance(caravanLocation.position) > 1e-6) {
      state.walkAnimation = Animations.makeBoundedTicker(120, (delta, t) => {
        let current = start.lerp(caravanLocation.position, t);
        this.x = current.x;
        this.y = current.y;
      }, () => state.walkAnimation = undefined);
    }

    if (idolState.state === "carried") {
      this.addChildAt(this.idol, 0);
    } else {
      this.removeChild(this.idol);
    }
  }
}
