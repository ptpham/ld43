import { State } from "./state";
import { IEntity } from "./entity";
import { C, SeedRandom, Debug } from "./constants";
import { getRandomTexture } from './lib/sprite';
import { Node } from "./graph";

const MAX_DEVIATION = 16;

export class Fog extends PIXI.Sprite implements IEntity {
  node: Node;
  speed: number;
  xDirection: number;
  xOrigin: number;

  constructor(node: Node) {
    super(getRandomTexture([
      PIXI.loader.resources['cloud_0'].texture,
      PIXI.loader.resources['cloud_1'].texture,
    ]));

    this.node = node;

    const x = node.position.x + (SeedRandom() * 48 - 24);
    const y = node.position.y + (SeedRandom() * 48 - 24);

    this.x = x - this.width * C.SPRITE_SCALE / 2;
    this.y = y - this.height * C.SPRITE_SCALE / 2;
    this.xOrigin = this.x;

    this.scale.x = C.SPRITE_SCALE;
    this.scale.y = C.SPRITE_SCALE;

    this.alpha = 0.6;
    this.speed = SeedRandom() * 0.5;
    this.xDirection = SeedRandom() > 0.5 ? 1 : -1;
  }

  update(state: State): void {
    if (Debug.FOG_OF_WAR_OFF) {
      this.alpha = 0;
      return;
    }

    if (state.idolState.state === 'gone' || this.node.isVisible(state.visitedNodes)) {
      if (this.alpha > 0) {
        this.alpha -= 0.01;
      }
    }

    if (Math.abs(this.x - this.xOrigin) >= MAX_DEVIATION) {
      this.xDirection = -1 * this.xDirection;
    }

    this.x += this.xDirection * this.speed;
  }
}
