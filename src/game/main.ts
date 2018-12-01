
import * as PIXI from 'pixi.js';
import { C } from './constants';
import { GameMap } from './gamemap';
import { State } from './state';

export class Game {
  stage   !: PIXI.Container;
  state   !: State;
  renderer!: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  loaded: Promise<Game>;

  constructor(div: HTMLDivElement) {
    this.setUpPixiStuff(div);

    C.SPRITE_ASSETS.forEach(asset => {
      PIXI.loader.add(asset, `assets/${asset}.png`);
    });

    this.loaded = new Promise((resolve, reject) => {
      PIXI.loader.load(() => {
        resolve(this);
      });
    });
  }

  public start(proxyHandler: any = {}): void {
    this.stage = new PIXI.Container();

    const sprite = new PIXI.Graphics();
    //sprite.x = 50;
    //sprite.y = 50;
    sprite.position.set(50,50);
    //sprite.lineTo(550,50);
    this.stage.addChild(sprite);

    const text = new PIXI.Text("Roguelike Dragon God Trail New Game Plus Simulator The Card Game 2");
    this.stage.addChild(text);
    text.x = 50;
    text.y = 0;

    const stest = new PIXI.Sprite(PIXI.loader.resources['test'].texture);
    stest.x = 10;
    stest.y = 10;
    stest.scale = new PIXI.Point(4, 4);
    this.stage.addChild(stest);

    this.animate();

    this.state = new Proxy(new State(
      this.stage,
    ), proxyHandler);

    new GameMap(this.state);
  }

  private setUpPixiStuff(div: HTMLDivElement): void {
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

    div.appendChild(this.renderer.view);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    this.renderer.render(this.stage);
  }
}
