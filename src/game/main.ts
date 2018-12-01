
import * as PIXI from 'pixi.js';
import { C } from './constants';
import { GameMap } from './gamemap';
import { State } from './state';

export class Game {
  stage   !: PIXI.Container;
  state   !: State;
  renderer!: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  view    !: HTMLCanvasElement;

  constructor() {
    this.setUpPixiStuff();

    this.stage = new PIXI.Container();
    this.state = new State(this.stage);
  }

  public start(proxyHandler: any = {}): void {
    this.state = new Proxy(this.state, proxyHandler);

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

    this.renderer.render(this.stage);

    for (const entity of this.state.entities) {
      entity.update(this.state);
    }
  }
}
