
import * as PIXI from 'pixi.js';
let { ticker: { Ticker } } = PIXI;

export function makeBoundedTicker(maxTime: number, cbTick: (delta:number, t: number) => void, cbEnd?: () => void) {
  let tick = new Ticker();
  let totalTime = 0;
  tick.add(delta => {
    totalTime += delta;
    if (totalTime > maxTime) {
      tick.stop();
      if (cbEnd) cbEnd();
      tick.destroy();
    }
    return cbTick(delta, Math.min(totalTime / maxTime, 1));
  });
  tick.start();
  return tick;
}

export function makeCrowdWalkAnimation(sprites: PIXI.Sprite[],
  options: { totalDuration: number, stepCount: number, displacement: number }) {

  let { totalDuration = 120, stepCount = 8, displacement = 4 } = options;
  let originalYs = sprites.map(sprite => sprite.y);

  let offsets: number[] = [];
  for (let i = 0; i < sprites.length; i++) {
    offsets.push(2*Math.PI*Math.random());
  }

  return makeBoundedTicker(totalDuration, (delta, t) => {
    for (let i = 0; i < offsets.length; i++) {
      sprites[i].y = displacement*Math.cos(offsets[i] + 2*Math.PI*stepCount*t) + originalYs[i];
    }
  }, () => {
    for (let i = 0; i < sprites.length; i++) {
      sprites[i].y = originalYs[i];
    }
  });
}


