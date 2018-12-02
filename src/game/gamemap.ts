
import { IEntity } from "./entity";
import { State } from "./state";

import { C } from "./constants";
import { Caravan } from "./caravan";
import { random } from "lodash";
import { Idol } from "./idol";
import { GraphSprite } from "./graphsprite";
import { Cloud } from "./cloud";
import { makeSprite } from "./lib/sprite";

export class GameMap extends PIXI.Sprite implements IEntity {
  state: State;
  graphSprite: GraphSprite;

  constructor(state: State) {
    super();

    this.state = state;
    this.makeBG();

    this.makeRiver();
    this.makeCanyon();

    this.graphSprite = this.makeGraph();
    this.addChild(this.graphSprite.graphSprite);

    this.makeCaravan();
    this.makeIdol();
    this.makeClouds();

    this.x = 50;
    this.y = 50;
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
    this.addChild(idol);
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
      this.addChild(cloud);
      this.state.addEntity(cloud);
    });
    return clouds;
  }

  update(state: State) {
    // update some circles
  }
}
