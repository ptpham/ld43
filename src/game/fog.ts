import { State } from "./state";
import { IEntity } from "./entity";
import { C } from "./constants";
import { getRandomTexture } from './lib/sprite';

export class Fog extends PIXI.Sprite implements IEntity {
  speed: number;

  constructor(x: number, y: number) {
    super(getRandomTexture([
      PIXI.loader.resources['cloud_0'].texture,
      PIXI.loader.resources['cloud_1'].texture,
    ]));
    this.y = y;
    this.x = x;
    this.scale.x = 2 * C.SPRITE_SCALE;
    this.scale.y = C.SPRITE_SCALE;
    this.alpha = 1;
    this.speed = 1;
  }

  update(state: State): void {
    // TODO
  }
}
