import { State } from "./state";
import { IEntity } from "./entity";
import { C } from "./constants";
import { SeedRandom } from './constants';

export class Cloud extends PIXI.Sprite implements IEntity {
  constructor() {
    super(
      PIXI.loader.resources['cloud'].texture
    );
    this.y = C.MAP_HEIGHT * SeedRandom();
    this.x = C.MAP_WIDTH * SeedRandom();
    this.scale.x = C.SPRITE_SCALE * 2;
    this.scale.y = C.SPRITE_SCALE;
    this.alpha = 0.3;
  }

  update(state: State): void {
    if (this.x > C.MAP_WIDTH) {
      this.y = C.MAP_HEIGHT * SeedRandom();
      this.x = -400;
    }
    this.x += 2;
  }
}
