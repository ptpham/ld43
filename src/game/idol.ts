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
    let start = new Point(this.x, this.y);
    let { caravan_location } = state;

    if (state.walkAnimation == null && start.distance(caravan_location.position) > 1e-6) {
      state.walkAnimation = Animations.makeBoundedTicker(120, (delta, t) => {
        let current = start.lerp(caravan_location.position, t);
        this.x = current.x;
        this.y = current.y;
      }, () => state.walkAnimation = undefined);
    }
  }
}
