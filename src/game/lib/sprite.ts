import { C, SeedRandom } from "../constants";

export function makeSprite(texture: PIXI.Texture): PIXI.Sprite {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = - sprite.width * C.SPRITE_SCALE / 2;
  sprite.y = - sprite.height * C.SPRITE_SCALE / 2;
  sprite.scale = new PIXI.Point(C.SPRITE_SCALE, C.SPRITE_SCALE);

  return sprite;
}

export function getRandomTexture(textures: PIXI.Texture[]) {
  const index = Math.floor(SeedRandom() * textures.length);
  return textures[index];
}
