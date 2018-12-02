
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

    for (const entity of this.state.entities) {
      entity.update(this.state);
    }
    this.renderer.render(this.stage);
  }
}
