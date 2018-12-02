import { State } from "./state";
import { IEntity } from "./entity";
import { GameMapCircle } from "./gamemap";

export class GraphSprite extends PIXI.Sprite implements IEntity {
  state: State;

  constructor(state: State) {
    super();

    this.state = state;

    this.build();
  }

  build() {
    const graphSprite = new PIXI.Graphics();
    graphSprite.lineWidth = 1;
    graphSprite.lineStyle(1, 0x000000)

    for (let node of this.state.graph) {
      for (let neighbor of node.neighbors) {
        graphSprite.moveTo(node.position.x, node.position.y);
        graphSprite.lineTo(neighbor.position.x, neighbor.position.y);
      }
    }

    for (let node of this.state.graph) {
      const newCircle = new GameMapCircle({ node, state: this.state });

      graphSprite.addChild(newCircle);
      this.state.addEntity(newCircle);
    }

    graphSprite.x = 50;
    graphSprite.y = 50;

    this.state.stage.addChild(graphSprite);

    return graphSprite;
  }

  update(state: State): void {
    
  }
}