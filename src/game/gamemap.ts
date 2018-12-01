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
      graphSprite.addChild(new GameMapCircle(node, state));
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
  public node: Node;
  public state: State;
  public selected: boolean = false;
  // callback for updating this entity on game loop tick... ?
  public pendingInteraction: () => void = () => {};

  constructor(node: Node, state: State) {
    super();
    this.node = node;
    this.state = state;

    // add a sprite
    if (node.locationType == 'Start') {
      const stest = new PIXI.Sprite(PIXI.loader.resources['caravan'].texture);
      stest.x = node.position.x + 2;
      stest.y = node.position.y + 2;
      stest.scale = new PIXI.Point(2, 2);
      this.addChild(stest);
    }

    this.lineWidth = 1;
    if (node.locationType === 'Start') {
      this.lineStyle(1, 0x00FF00);
    } else if (node.locationType === 'Finish') {
      this.lineStyle(1, 0xFF0000);
    } else {
      this.lineStyle(1, 0x000000);
    }
    this.drawCircle(node.position.x, node.position.y, 16);
    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, 16);
    this.on('click', (e: PIXI.interaction.InteractionEvent) => {
      console.log(this.node);

      if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
        this.pendingInteraction = () => {
          this.selected = !this.selected;
          if (this.selected) {
            this.graphicsData[0].lineWidth = 3;
          } else {
            this.graphicsData[0].lineWidth = 1;
            //this.removeChildAt(0);
          }
          this.dirty++;
          this.clearDirty++;
        }
      }
      // lol
      this.pendingInteraction();
      this.pendingInteraction = () => {};
    })
  }

  update(state: State): void {
    if (this.pendingInteraction) {
      this.lineWidth = 10;
    }
  }
}