
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
      [PIXI.loader.resources['blight_particle'].texture], 
      //[],
      {
        alpha: {
          list: [
            {
              value: 0.8,
              time: 0
            },
            {
              value: 0.1,
              time: 1
            }
          ],
          isStepped: false
        },
        scale: {
          list: [
            {
              value: 1,
              time: 0
            },
            {
              value: 0.3,
              time: 1
            }
          ],
          isStepped: false
        },
        color: {
          list: [
            {
              value: "fb1010",
              time: 0
            },
            {
              value: "f5b830",
              time: 1
            }
          ],
          isStepped: false
        },
        speed: {
          list: [
            {
              value: 200,
              time: 0
            },
            {
              value: 100,
              time: 1
            }
          ],
          isStepped: false
        },
        startRotation: {
          min: 0,
          max: 360
        },
        rotationSpeed: {
          min: 0,
          max: 0
        },
        lifetime: {
          min: 0.5,
          max: 0.5
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 0.31,
        maxParticles: 1000,
        pos: {
          x: 0,
          y: 0
        },
        addAtBack: false,
        spawnType: "circle",
        spawnCircle: {
          x: 0,
          y: 0,
          r: 10
        }
      }
    );
  }

  public start(proxyHandler: any = {}): void {
    this.state = new Proxy(this.state, proxyHandler);

    this.emitter.emit = true;
    this.gameLoop();

    new GameMap(this.state);

    const stest = new PIXI.Sprite(PIXI.loader.resources['test'].texture);
    stest.x = 10;
    stest.y = 10;
    stest.scale = new PIXI.Point(4, 4);
    this.state.stage.addChild(stest);

  }

  private setUpPixiStuff(): void {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
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

    //this.renderer.render(this.stage);
    let now = Date.now();
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;

    for (const entity of this.state.entities) {
      entity.update(this.state);
    }
    this.renderer.render(this.stage);
  }
}
