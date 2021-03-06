//import { C } from "./constants";
//import { IEntity } from './entity';
import { Emitter } from 'pixi-particles';
import { State } from "./state";

export class Particles extends Emitter {
  public elapsed: number = Date.now();
  public asset_name!: string;
  constructor(parent: PIXI.Container, x: number, y: number, corruptness: number, asset_name: string = 'purple_particle') {
    super(
      parent,
      [PIXI.loader.resources[asset_name].texture], 
      {
        // alpha decays from 1 to 0
        alpha: { list: [ { value: 1, time: 0 }, { value: 0, time: 1 } ], isStepped: false },
        // scale is always 2
        scale: { list: [ { value: 2, time: 0 }, { value: 2, time: 1 } ], isStepped: false, minimumScaleMultiplier: 1 },
        // can we disable color please?
        color: { list: [ { value: {r: 0xFF, g: 0xFF, b: 0xFF, a: 1}, time: 0 }, { value: {r: 0xFF, g: 0xFF, b: 0xFF, a: 1}, time: 1 } ], isStepped: false },
        // speed always 25, but with 1x-2x random multiplier
        speed: { list: [ { value: 25, time: 0 }, { value: 25, time: 1 } ], isStepped: false, minimumSpeedMultiplier: 2 },
        // always fire particles up
        startRotation: { min: 270, max: 270 },
        // they do not rotate
        rotationSpeed: { min: 0, max: 0 },
        // lifetime -- tunable, around .5 ish works fine
        lifetime: { min: 0.4, max: 0.6 },
        // seconds per particle
        frequency: (1.0 / corruptness),
        spawnChance: 1,
        particlesPerWave: 1,
        // emit forever
        emitterLifetime: -1,
        maxParticles: 1000,
        pos: { x: 0, y: 0 },
        addAtBack: false,
        // radius 100
        spawnType: "circle",
        spawnCircle: { x: x, y: y, r: 16 },
        // auto start emitting
        emit: true
      }
    )
    this.asset_name = asset_name;
    this.emit = true;
  }

  disable(garbage_collect_cb: () => void): void {
    // carefully!
    this.emit = false;
    // garbage collect myself after around 1 second ish
    setTimeout(garbage_collect_cb, 2000)
  }

  update_(state: State): void {
    let now: number = Date.now();
    this.update((now - this.elapsed) * 0.001);
    this.elapsed = now;
  }
}