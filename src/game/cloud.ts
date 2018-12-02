import { State } from "./state";
import { IEntity } from "./entity";
import { C } from "./constants";
import { SeedRandom } from './constants';
import { getRandomTexture } from './lib/sprite';

export class Cloud extends PIXI.Sprite implements IEntity {
  speed: number;

  constructor() {
    super(getRandomTexture([
      PIXI.loader.resources['cloud_0'].texture,
      PIXI.loader.resources['cloud_1'].texture,
    ]));
    this.y = C.MAP_HEIGHT * SeedRandom();
    this.x = C.MAP_WIDTH * SeedRandom();
    this.scale.x = 2 * C.SPRITE_SCALE;
    this.scale.y = C.SPRITE_SCALE;
    this.alpha = 0.3;
    this.speed = 1 + 2 * SeedRandom();
  }

  update(state: State): void {
    if (state.idolState.state === 'gone') {
      if (this.alpha > 0) {
        this.alpha -= 0.01;
      }
    } else if (this.x > C.MAP_WIDTH) {
      this.y = C.MAP_HEIGHT * SeedRandom();
      this.x = -400;
      this.texture = getRandomTexture([
        PIXI.loader.resources['cloud_0'].texture,
        PIXI.loader.resources['cloud_1'].texture,
      ]);
      this.speed = 1 + 2 * SeedRandom();
    }
    this.x += this.speed;
  }
}
