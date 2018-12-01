import { Entity } from "./entity";
import { State } from "./main";

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
      const graphCircle = new PIXI.Graphics();
      graphCircle.lineWidth = 1;
      graphCircle.lineStyle(1, 0x000000);
      graphCircle.drawCircle(node.position.x, node.position.y, 16);
      graphCircle.interactive = true;
      graphCircle.hitArea = new PIXI.Circle(node.position.x, node.position.y, 16);
      graphCircle.on('click', (e: PIXI.interaction.InteractionEvent) => {
        console.log(node);
      })
      graphSprite.addChild(graphCircle);
    }

    graphSprite.x = 50;
    graphSprite.y = 50;
    //graphSprite.interactive = true;
    //graphSprite.hitArea = new PIXI.Rectangle(50, 50, 500, 500);
    //graphSprite.on('click', (e: PIXI.interaction.InteractionEvent) => {
    //  console.log(e.data.global);
    //})
    state.stage.addChild(graphSprite);
  }
}