import { C } from "../constants";

export function makeSprite(texture: PIXI.Texture): PIXI.Sprite {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = - sprite.width * C.SPRITE_SCALE / 2;
  sprite.y = - sprite.height * C.SPRITE_SCALE / 2;
  sprite.scale = new PIXI.Point(C.SPRITE_SCALE, C.SPRITE_SCALE);

  return sprite;
}
