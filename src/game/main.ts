
import * as PIXI from 'pixi.js';
import { C } from './constants';
import { GameMap } from './gamemap';
import { State } from './state';
import { Emitter } from 'pixi-particles';

export class Game {
  stage   !: PIXI.Container;
  state   !: State;
  renderer!: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  view    !: HTMLCanvasElement;
  emitter !: Emitter;
  elapsed  : number = Date.now(); // need to keep track of wall clock time for pixi.particles.emitter

  constructor() {
    this.setUpPixiStuff();

    this.stage = new PIXI.Container();
    this.state = new State(this.stage);

    this.emitter = new Emitter(
      this.state.stage, 
      [PIXI.loader.resources['purple_particle'].texture], 
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
        frequency: 0.01667,
        spawnChance: 1,
        particlesPerWave: 1,
        // emit forever
        emitterLifetime: -1,
        maxParticles: 1000,
        pos: { x: 0, y: 0 },
        addAtBack: false,
        // radius 100
        spawnType: "circle",
        spawnCircle: { x: 30, y: 30, r: 16 }
      }
    );
  }

  public start(proxyHandler: any = {}): void {
    this.state = new Proxy(this.state, proxyHandler);

    this.emitter.emit = true;
    this.gameLoop();

    const gameMap = new GameMap(this.state);

    this.state.stage.addChild(gameMap);
    this.state.gameMap = gameMap;

    const stest = new PIXI.Sprite(PIXI.loader.resources['test'].texture);
    stest.x = 10;
    stest.y = 10;
    stest.scale = new PIXI.Point(4, 4);
    this.state.stage.addChild(stest);

    //const pTest = new PIXI.Sprite(PIXI.loader.resources['purple_particle'].texture);
    //pTest.x = 100;
    //pTest.y = 100;
    //pTest.scale = new PIXI.Point(16, 16);
    //this.state.stage.addChild(pTest);
  }

  private setUpPixiStuff(): void {
    this.renderer = PIXI.autoDetectRenderer(
      C.CANVAS_WIDTH,
      C.CANVAS_HEIGHT, {
        antialias  : true,
        autoResize : true,
        transparent: true,
        resolution : 1
      }
    );

    this.view = this.renderer.view;
  }


  gameLoop(): void {
    requestAnimationFrame(() => this.gameLoop());

    this.renderer.render(this.stage);
    let now = Date.now();
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;

    for (const entity of this.state.entities) {
      entity.update(this.state);
    }
    this.renderer.render(this.stage);
  }
}
