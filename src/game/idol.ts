import { State } from "./state";
import { IEntity } from "./entity";

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
    const idolState = state.idolState;

    if (idolState.state === "carried") {
      this.x = state.caravan_location.position.x;
      this.y = state.caravan_location.position.y;
    } else if (idolState.state === "dropped") {
      this.x = idolState.position
      this.y = state.caravan_location.position.y;

    } else {
      const _x: never = idolState;

      throw new Error(`expected never, got ${ _x }`);
    }
  }
}
