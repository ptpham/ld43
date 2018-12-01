
import { Entity, IEntity } from "./entity";
import { State } from "./state";
import { Node } from "./graph";

import { C } from "./constants";
import { Caravan } from "./caravan";
import { Graphics } from "pixi.js";
import { random } from "lodash";
import { Idol } from "./idol";

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
    this.makeBG();

    this.graphSprite = this.makeGraph();

    this.makeCaravan();
    this.makeIdol();
  }

  makeBG(): void {
    const container = new PIXI.Container();
    const grasslandTextures: PIXI.Texture[] = [
      PIXI.loader.resources['grassland_0'].texture,
      PIXI.loader.resources['grassland_1'].texture,
      PIXI.loader.resources['grassland_2'].texture,
      PIXI.loader.resources['grassland_3'].texture,
      PIXI.loader.resources['grassland_4'].texture,
      PIXI.loader.resources['grassland_5'].texture,
      PIXI.loader.resources['grassland_6'].texture,
      PIXI.loader.resources['grassland_7'].texture,
      PIXI.loader.resources['grassland_8'].texture,
    ];

    // Assuming tiles are square
    const tileSize = grasslandTextures[0].width * C.SPRITE_SCALE;
    for (let y = 0; y < C.CANVAS_HEIGHT; y += tileSize) {
      for (let x = 0; x < C.CANVAS_WIDTH; x += tileSize) {
        const index = random(0, grasslandTextures.length - 1);
        container.addChild(makeSprite(grasslandTextures[index], x, y));
      }
    }
    this.state.stage.addChild(container);
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

  makeIdol(): Idol {
    const idol = new Idol(this.state);

    return idol;
  }

  update(state: State) {
    // update some circles
  }
}

export class GameMapCircle extends PIXI.Graphics implements IEntity {
  public node: Node;
  public state: State;
  public selected: boolean = false;

  private mousedOver = false;

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
    } else if (node.locationType == 'Forest') {
      this.addChild(makeSprite(PIXI.loader.resources['forest'].texture,
        node.position.x,
        node.position.y,
      ));
    } else if (node.locationType == 'GoblinNest') {
      this.addChild(makeSprite(PIXI.loader.resources['goblin'].texture,
        node.position.x,
        node.position.y,
      ));
    } else if (node.locationType == 'River') {
      this.addChild(makeSprite(PIXI.loader.resources['test'].texture,
        node.position.x,
        node.position.y,
      ));
    }

    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, C.NODE_RADIUS);

    this.on('click', () => this.onClick());
    this.on('mouseover', () => this.mouseOver());
    this.on('mouseout', () => this.mouseOut());

    this.render();
  }

  mouseOver(): void {
    this.mousedOver = true;

    this.render();
  }

  mouseOut(): void {
    this.mousedOver = false;

    this.render();
  }

  onClick(): void {
    //if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
    if (true) {
      if (this.selected) {
        this.selected = false;
        // we just double clicked this node
        // can only select nodes adjacent to current caravan location to move caravan to

        if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
          this.state.moveCaravan(this.node);
        }

        this.state.selectedNextLocation = undefined;
      } else {
        // unselect the other guy
        let lastLocation = this.state.selectedNextLocation;
        if (lastLocation) {
          lastLocation.selected = false;
          lastLocation.render();
        }
        this.state.selectedNextLocation = this;
        this.selected = true;
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
    if (this.selected) {
      this.x = -4;
      this.y = -4;
      //this.scale = new PIXI.Point(1.25, 1.25);
    } else {
      this.x = 0;
      this.y = 0;
      //this.scale = new PIXI.Point(1.0, 1.0);
    }
    //console.log(this)
    //for (let child of this.children) {
    //  console.log(child)
    //}

    if (this.mousedOver) {
      this.scale.x = 1.2;
      this.scale.y = 1.2;
    } else {
      this.scale.x = 1;
      this.scale.y = 1;
    }
  }

  update(state: State): void {
  }
}
