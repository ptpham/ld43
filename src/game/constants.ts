import _ from 'lodash';

export class Debug {
  public static SeedRandom = true;
}

export class C {
  public static CANVAS_WIDTH = 1000;
  public static CANVAS_HEIGHT = 600;

  public static MAP_WIDTH = 1000;
  public static MAP_HEIGHT = 1000;

  public static NODE_RADIUS = 16;
  public static SPRITE_SCALE = 2;

  public static IDOL_MEAT_COST = 1;

  public static SPRITE_ASSETS = [
    'test',
    'idol',
    'canyon',
    'caravan',
    'volcano',
    'forest',
    'goblin',
    'grass',
    'grassland_0',
    'grassland_1',
    'grassland_2',
    'grassland_3',
    'grassland_4',
    'grassland_5',
    'grassland_6',
    'grassland_7',
    'grassland_8',
    'river',
    'blight_particle'
  ];
}

export const Sample = <T> (x: T[]): T => {
  return x[Math.floor(SeedRandom() * x.length)];
}

export const SeedRandom = (function() {
  // 0x2F6E2B1

  var seed = Debug.SeedRandom ? 0x2F6E2B2 : Math.random();

	return function() {

		// Robert Jenkins’ 32 bit integer hash function
		seed = ((seed + 0x7ED55D16) + (seed << 12))  & 0xFFFFFFFF;
		seed = ((seed ^ 0xC761C23C) ^ (seed >>> 19)) & 0xFFFFFFFF;
		seed = ((seed + 0x165667B1) + (seed << 5))   & 0xFFFFFFFF;
		seed = ((seed + 0xD3A2646C) ^ (seed << 9))   & 0xFFFFFFFF;
		seed = ((seed + 0xFD7046C5) + (seed << 3))   & 0xFFFFFFFF;
    seed = ((seed ^ 0xB55A4F09) ^ (seed >>> 16)) & 0xFFFFFFFF;

    const result = (seed & 0xFFFFFFF) / 0x10000000;
    return result;
	};
}());

Math.random = SeedRandom;

_.sample = () => { alert("Stop using lodash.sample peter, use SeedRandom"); return 0; }