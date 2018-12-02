import { State } from "./state";
import { IEntity } from "./entity";
import { Location } from "./location";
import { C, Debug } from "./constants";
import { Line } from "./lib/line";

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
    let visibleNodes = new Set();

    for (const node of visitedNodes) {
      visibleNodes.add(node);

      for (const neighbor of node.neighbors) {
        visibleNodes.add(neighbor);
      }
    }

    if (Debug.FOG_OF_WAR_OFF) {
      visibleNodes = new Set(this.state.graph);
    }

    // clear the old nodes
    this.graphSprite.clear();
    this.graphSprite.removeChildren();

    this.graphSprite.lineWidth = 1;
    this.graphSprite.lineStyle(1, 0x000000)

    console.log(this.state.visitedNodes);
    for (let node of visibleNodes) {
      for (let neighbor of node.neighbors) {
        if (!visibleNodes.has(neighbor)) { continue; }

        // Trim off the ends so we have road breaks for rivers and canyons
        const line = new Line({one: node.position, two: neighbor.position});
        line.trimEnds(18);

        const road = new PIXI.mesh.Rope(
          PIXI.loader.resources['road'].texture,
          [
            new PIXI.Point(line.start.x, line.start.y),
            new PIXI.Point(line.end.x, line.end.y),
          ]
        );

        if (
          node.locationType === neighbor.locationType &&
          node.locationType === 'River') {
          // If we're joining two rivers, tint the road blue
          road.tint = 0x69d2e7;
        }

        if (
          node.locationType === neighbor.locationType &&
          node.locationType === 'Canyon') {
          // If we're joining two canyons, tint the road red
          road.tint = 0xc44d58;
        }
        this.graphSprite.addChild(road);
      }
    }

    for (let node of visibleNodes) {
      const newCircle = new Location({ node, state: this.state });

      this.graphSprite.addChild(newCircle);
      this.state.addEntity(newCircle);
      if (!visitedNodes.has(node)) {
        // add a question mark to unvisited ones
        const qMarkSprite = new PIXI.Sprite(PIXI.loader.resources['question_mark'].texture);
        qMarkSprite.scale = new PIXI.Point(C.SPRITE_SCALE * 0.75, C.SPRITE_SCALE * 0.75);
        qMarkSprite.x = node.position.x - qMarkSprite.width / 2;
        qMarkSprite.y = node.position.y - qMarkSprite.height / 2;
        this.graphSprite.addChild(qMarkSprite);
      }
    }

    this.graphSprite.x = 0;
    this.graphSprite.y = 0;

    return this.graphSprite;
  }

  update(state: State): void {
    
  }
}