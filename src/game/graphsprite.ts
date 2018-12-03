import { State } from "./state";
import { IEntity } from "./entity";
import { Location } from "./location";
import { C, Debug } from "./constants";
import { Line } from "./lib/line";
import * as Graph from '../game/graph';
import { CONTINUE_TEXT } from "./events";

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
    let visibleNodes = new Set<Graph.Node>();

    if (Debug.FOG_OF_WAR_OFF) {
      visibleNodes = new Set(this.state.graph);
    } else {
      this.state.graph.forEach(node => {
        if (node.isVisible(visitedNodes)) {
          visibleNodes.add(node);
        }
      });
    }

    // clear the old nodes
    this.graphSprite.clear();
    this.graphSprite.removeChildren();

    this.graphSprite.lineWidth = 1;
    this.graphSprite.lineStyle(1, 0x000000)

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
      const newCircle = new Location({ 
        node, 
        state: this.state,
        visited: visitedNodes.has(node),
      });

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

      if (
        node.event &&
        !node.eventSeen &&
        node.event.options && (
          node.event.options.length === 1 && 
          node.event.options[0].description === CONTINUE_TEXT
        ) &&
        visitedNodes.has(node)
      ) {
        // add meat text
        const outcome = node.event.options[0].outcome[0];

        if (outcome.type === "lose-meat") {
          const text = new PIXI.Text(
            "-" + outcome.amount, {
              fontFamily: "Softsquare",
              fontSize  : 24, 
              fill      : 0xff0000, 
              align     : 'left',
              dropShadow: true,
              dropShadowColor: "black",
              dropShadowDistance: 2,
            }
          );

          this.graphSprite.addChild(text);

          text.x = node.position.x - text.width / 2;
          text.y = node.position.y - text.height / 2;
        }
      }

      if (
        node.event &&
        !node.eventSeen &&
        node.event.options && (
          node.event.options.length > 1 || (
            node.event.options.length === 1 && 
            node.event.options[0].description !== CONTINUE_TEXT
          )
        ) &&
        visitedNodes.has(node)
      ) {
        // add informational blue square

        const blueSquare = new PIXI.Sprite(PIXI.loader.resources['todo'].texture);
        blueSquare.scale = new PIXI.Point(C.SPRITE_SCALE * 0.75, C.SPRITE_SCALE * 0.75);
        blueSquare.x = node.position.x - blueSquare.width / 2;
        blueSquare.y = node.position.y - blueSquare.height / 2;
        this.graphSprite.addChild(blueSquare);
      }
    }

    this.graphSprite.x = 0;
    this.graphSprite.y = 0;

    return this.graphSprite;
  }

  update(state: State): void {
    
  }
}