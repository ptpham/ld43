import { State } from "./state";
import { IEntity } from "./entity";

export class Caravan extends PIXI.Sprite implements IEntity {
  constructor() {
    super(
      PIXI.loader.resources['caravan'].texture
    );
  }

  public moveTo(node: Node): void {

  }

  update(state: State): void {
    this.x = state.caravan_location.position.x;
    this.y = state.caravan_location.position.y;
  }
}

/*
function moveCaravanTo(nodeGraphix: GameMapCircle, state: State): (() => void) {
  // first generate the callback
  let onUpdate = ((old_location_graphix) => () => {
    //state.caravan_location_graphix.removeChildAt(0);
    old_location_graphix.removeChildAt(old_location_graphix.children.length - 1);
    const stest = new PIXI.Sprite(PIXI.loader.resources['caravan'].texture);
    stest.x = nodeGraphix.node.position.x - 2;
    stest.y = nodeGraphix.node.position.y - 2;
    stest.scale = new PIXI.Point(2, 2);
    nodeGraphix.addChild(stest);
  })(state.caravan_location_graphix)

  // now update caravan location
  state.caravan_location = nodeGraphix.node;
  state.caravan_location_graphix = nodeGraphix;
  state.isLocationDone = false;
  return onUpdate;
}
*/