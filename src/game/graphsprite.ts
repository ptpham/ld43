import { State } from "./state";
import { IEntity } from "./entity";
import { GameMapCircle } from "./gamemap";
import { C } from "./constants";

export class GraphSprite extends PIXI.Sprite implements IEntity {
  state: State;
  graphSprite: PIXI.Graphics;

  constructor(state: State) {
    super();

    this.state = state;
    this.graphSprite = new PIXI.Graphics();

    this.render();
  }

  render() {
    const visitedNodes = this.state.visitedNodes;
    const visibleNodes = new Set();

    for (const node of visitedNodes) {
      visibleNodes.add(node);

      for (const neighbor of node.neighbors) {
        visibleNodes.add(neighbor);
      }
    }

    // clear the old nodes
    this.graphSprite.clear();

    this.graphSprite.lineWidth = 1;
    this.graphSprite.lineStyle(1, 0x000000)

    console.log(this.state.visitedNodes);
    for (let node of visibleNodes) {
      for (let neighbor of node.neighbors) {
        if (!visibleNodes.has(neighbor)) { continue; }

        this.graphSprite.moveTo(node.position.x, node.position.y);
        this.graphSprite.lineTo(neighbor.position.x, neighbor.position.y);
      }
    }

    for (let node of visibleNodes) {
      const newCircle = new GameMapCircle({ node, state: this.state });

      this.graphSprite.addChild(newCircle);
      if (!visitedNodes.has(node)) {
        // add a question mark to unvisited ones
        const qMarkSprite = new PIXI.Sprite(PIXI.loader.resources['question_mark'].texture);
        qMarkSprite.scale = new PIXI.Point(C.SPRITE_SCALE * 0.75, C.SPRITE_SCALE * 0.75);
        qMarkSprite.x = node.position.x - qMarkSprite.width / 2;
        qMarkSprite.y = node.position.y - qMarkSprite.height / 2;
        newCircle.addChild(qMarkSprite);
      }
      this.state.addEntity(newCircle);
    }

    this.graphSprite.x = 0;
    this.graphSprite.y = 0;

    if (this.state.stage.children.indexOf(this.graphSprite) === -1) {
      this.state.stage.addChild(this.graphSprite);
      this.graphSprite.clear();
      for (let child of this.graphSprite.children) {
        let child_ : any = child;
        child_.clear && typeof child_.clear === 'function' && child_.clear();
      }
    }

    return this.graphSprite;
  }

  update(state: State): void {
    
  }
}