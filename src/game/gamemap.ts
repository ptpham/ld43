
import { IEntity } from "./entity";
import { State } from "./state";
import { Node } from "./graph";

import { C } from "./constants";
import { Caravan } from "./caravan";
import { random } from "lodash";
import { Idol } from "./idol";
import { GraphSprite } from "./graphsprite";
import { Cloud } from "./cloud";
import { Particles } from "./particles";
Particles;

function makeSprite(texture: PIXI.Texture): PIXI.Sprite {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = - sprite.width * C.SPRITE_SCALE / 2;
  sprite.y = - sprite.height * C.SPRITE_SCALE / 2;
  sprite.scale = new PIXI.Point(C.SPRITE_SCALE, C.SPRITE_SCALE);

  return sprite;
}

export class GameMap extends PIXI.Sprite implements IEntity {
  state: State;
  graphSprite: GraphSprite;

  constructor(state: State) {
    super();

    this.state = state;
    this.makeBG();

    this.graphSprite = this.makeGraph();
    this.addChild(this.graphSprite);

    this.makeRiver();
    this.makeCanyon();

    this.makeCaravan();
    this.makeIdol();
    this.makeClouds();
  }

  makeBG(): void {
    //return;
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

        const sprite = makeSprite(grasslandTextures[index]);

        sprite.x = x;
        sprite.y = y;
        container.addChild(sprite);
      }
    }
    this.state.stage.addChild(container);
  }

  makeGraph(): GraphSprite {
    return new GraphSprite(this.state);
  }

  makeRiver(): PIXI.mesh.Rope {
    const river = new PIXI.mesh.Rope(PIXI.loader.resources['river'].texture, this.state.river);
    this.addChildAt(river, 0);
    return river;
  }

  makeCanyon(): PIXI.mesh.Rope {
    const canyon = new PIXI.mesh.Rope(PIXI.loader.resources['canyon'].texture, this.state.canyon);
    this.addChildAt(canyon, 0);
    return canyon;
  }

  makeCaravan(): Caravan {
    const startNode = this.state.graph.filter(x => x.locationType === "Start")[0];

    const caravan = new Caravan();
    caravan.x = startNode.position.x;
    caravan.y = startNode.position.y;

    this.state.addEntity(caravan);

    this.addChild(caravan);

    return caravan;
  }

  makeIdol(): Idol {
    const idol = new Idol(this.state);

    return idol;
  }

  makeClouds(): Cloud[] {
    const clouds = [
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
      new Cloud(),
    ];
    clouds.forEach(cloud => {
      this.graphSprite.addChild(cloud);
      this.state.addEntity(cloud);
    });
    return clouds;
  }

  update(state: State) {
    // update some circles
  }
}

export class GameMapCircle extends PIXI.Graphics implements IEntity {
  public node: Node;
  public state: State;
  public selected: boolean = false;
  public particles: Particles | undefined;

  private mousedOver = false;

  constructor(props: { 
    node: Node;
    state: State;
  }) {
    super();

    const { node, state } = props;

    this.node = node;
    this.state = state;

    let sprite: PIXI.Sprite | undefined = undefined;

    // add a sprite
    if (node.locationType == 'Start') {
      sprite = makeSprite(PIXI.loader.resources['grass'].texture);
    } else if (node.locationType == 'Finish') {
      // mount DOOM!
      sprite = makeSprite(PIXI.loader.resources['volcano'].texture);
    } else if (node.locationType == 'Forest') {
      sprite = makeSprite(PIXI.loader.resources['forest'].texture);
    } else if (node.locationType == 'GoblinNest') {
      sprite = makeSprite(PIXI.loader.resources['goblin'].texture);
    }

    if (sprite) {
      this.addChild(sprite);

      sprite.x = node.position.x - sprite.width / 2;
      sprite.y = node.position.y - sprite.height / 2;
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
    this.state.mousedOverLocation = this;
    this.particles = new Particles(this, this.node.position.x, this.node.position.y, 6);

    this.render();
  }

  mouseOut(): void {
    this.mousedOver = false;
    this.state.mousedOverLocation = undefined;
    this.particles = undefined;

    this.render();
  }

  onClick(): void {
    //if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
    if (true) {
      if (this.selected) {
        this.selected = false;
        // we just double clicked this node
        // can only select nodes adjacent to current caravan location to move caravan to

        if (this.state.caravanLocation.neighbors.indexOf(this.node) > -1) {
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

    if (this.selected) {
      this.x = -4;
      this.y = -4;
    } else {
      this.x = 0;
      this.y = 0;
    }

    if (this.mousedOver) {
      for (const child of this.children) {
        (child as any).tint = 0xdddddd;
      }
    } else {
      for (const child of this.children) {
        (child as any).tint = 0xffffff;
      }
    }

    this.drawCircle(this.node.position.x, this.node.position.y, 16);
  }

  update(state: State): void {
    if (this.particles) {
      this.particles.update_(state);
    }
  }
}
