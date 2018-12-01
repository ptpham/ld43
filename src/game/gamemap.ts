import { Entity, IEntity } from "./entity";
import { State } from "./main";
import { Node } from "./graph";

export class GameMap extends Entity {
  state: State;

  constructor(state: State) {
    super();

    this.state = state;

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
      graphSprite.addChild(new GameMapCircle(node));
      //const graphCircle = new PIXI.Graphics();
      //graphCircle.lineWidth = 1;
      //graphCircle.lineStyle(1, 0x000000);
      //graphCircle.drawCircle(node.position.x, node.position.y, 16);
      //graphCircle.interactive = true;
      //graphCircle.hitArea = new PIXI.Circle(node.position.x, node.position.y, 16);
      //graphCircle.on('click', (e: PIXI.interaction.InteractionEvent) => {
      //  console.log(node);
      //})
      //graphSprite.addChild(graphCircle);
    }

    graphSprite.x = 50;
    graphSprite.y = 50;
    state.stage.addChild(graphSprite);
  }

  update(state: State) {
    // update some circles
  }
}

class GameMapCircle extends PIXI.Graphics implements IEntity {
  public m_node: Node;
  public pendingInteraction: boolean; // flag for whether we need to rerender this guy

  constructor(node: Node) {
    super();
    this.pendingInteraction = false;
    this.m_node = node;
    this.lineWidth = 1;
    this.lineStyle(1, 0x000000);
    this.drawCircle(node.position.x, node.position.y, 16);
    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, 16);
    this.on('click', (e: PIXI.interaction.InteractionEvent) => {
      console.log(this.m_node);
      this.pendingInteraction = true;
      this.lineWidth = 10;
      this.dirty++;
      this.clearDirty++;

      const stest = new PIXI.Sprite(PIXI.loader.resources['test'].texture);
      stest.x = 0;
      stest.y = 0;
      this.addChild(stest);

    })

  }

  update(state: State): void {
    if (this.pendingInteraction) {
      this.lineWidth = 10;
    }
  }
}