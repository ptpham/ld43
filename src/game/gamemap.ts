
import { Entity, IEntity } from "./entity";
import { State } from "./state";
import { Node } from "./graph";

import { C } from "./constants";
import { Caravan } from "./caravan";
import { Graphics } from "pixi.js";
import { random } from "lodash";

function makeSprite(texture: PIXI.Texture, x: number, y: number): PIXI.Sprite {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = x - sprite.width * C.SPRITE_SCALE / 2;
  sprite.y = y - sprite.height * C.SPRITE_SCALE / 2;
  sprite.scale = new PIXI.Point(C.SPRITE_SCALE, C.SPRITE_SCALE);
  return sprite;
}

export class GameMap extends Entity {
  state: State;
  graphSprite: Graphics;

  constructor(state: State) {
    super();

    this.state = state;

    this.graphSprite = this.makeGraph();

    // add caravan

    this.makeCaravan();
  }

  makeBG(): PIXI.Container {
    const container = new PIXI.Container();
    const grasslandTextures: PIXI.Texture[] = [
      PIXI.loader.resources['grassland-0'].texture,
      PIXI.loader.resources['grassland-1'].texture,
      PIXI.loader.resources['grassland-2'].texture,
      PIXI.loader.resources['grassland-3'].texture,
      PIXI.loader.resources['grassland-4'].texture,
      PIXI.loader.resources['grassland-5'].texture,
      PIXI.loader.resources['grassland-6'].texture,
      PIXI.loader.resources['grassland-7'].texture,
      PIXI.loader.resources['grassland-8'].texture,
    ];

    // Assuming tiles are square
    const tileSize = grasslandTextures[0].width * C.SPRITE_SCALE;
    let posX = 0;
    let posY = 0;
    let iter = 0;
    const maxIter = 10000;
    while (posY < C.CANVAS_HEIGHT) {
      while (posX < C.CANVAS_WIDTH) {
        const index = random(0, grasslandTextures.length);
        container.addChild(makeSprite(grasslandTextures[index], posX, posY));
        posX += tileSize;
        posY += tileSize;
        iter++;
        if (iter >= maxIter) {
          return container;
        }
      }
    }

    return container;
  }

  makeGraph(): PIXI.Graphics {
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

  makeCaravan(): Caravan {
    const startNode = this.state.graph.filter(x => x.locationType === "Start")[0];

    const caravan = new Caravan();
    caravan.x = startNode.position.x;
    caravan.y = startNode.position.y;

    this.state.addEntity(caravan);

    this.graphSprite.addChild(caravan);

    return caravan;
  }

  update(state: State) {
    // update some circles
  }
}

export class GameMapCircle extends PIXI.Graphics implements IEntity {
  public node: Node;
  public state: State;
  public selected: boolean = false;

  constructor(props: { 
    node: Node;
    state: State;
  }) {
    super();
    const { node, state } = props;

    this.node = node;
    this.state = state;

    // add a sprite
    if (node.locationType == 'Start') {
      this.addChild(makeSprite(PIXI.loader.resources['grass'].texture,
        node.position.x,
        node.position.y,
      ));

    } else if (node.locationType == 'Finish') {
      // mount DOOM!
      this.addChild(makeSprite(PIXI.loader.resources['volcano'].texture,
        node.position.x,
        node.position.y,
      ));
    }

    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, 16);

    this.on('click', () => this.onClick());

    this.render();
  }

  onClick(): void {
    // can only select nodes adjacent to current caravan location
    if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
      this.selected = !this.selected;

      if (!this.selected) {
        // we just double clicked this node
        this.state.caravan_location = this.node;
        this.state.isLocationDone = false;
      }

      this.render();
    }
  }

  render(): void {
    this.clear();

    this.lineWidth = this.selected ? 3 : 1;

    if (this.node.locationType === 'Start') {
      this.lineStyle(this.lineWidth, 0x00FF00);
    } else if (this.node.locationType === 'Finish') {
      this.lineStyle(this.lineWidth, 0xFF0000);
      this.lineWidth = 0;
    } else {
      this.lineStyle(this.lineWidth, 0x000000);
    }

    this.drawCircle(this.node.position.x, this.node.position.y, 16);
  }

  update(state: State): void {
  }
}
