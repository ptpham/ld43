import { State } from "./state";
import { IEntity } from "./entity";

/**
 * State for idol is on state.idolState.
 */
export class Idol extends PIXI.Sprite implements IEntity {
  constructor(state: State) {
    super(
      PIXI.loader.resources['idol'].texture
    );

    state.addEntity(this);

    this.scale.x = 2;
    this.scale.y = 2;
  }

  update(state: State): void {
    const idolState = state.idolState;

    if (idolState.state === "carried" || state.hasWon) {
      this.alpha = 0;
      // this.x = state.caravanLocation.position.x;
      // this.y = state.caravanLocation.position.y;
    } else if (idolState.state === "dropped") {
      this.alpha = 1;
      this.x = idolState.node.position.x;
      this.y = idolState.node.position.y;
    } else {
      const _x: never = idolState;

      throw new Error(`expected never, got ${ _x }`);
    }
  }
}
