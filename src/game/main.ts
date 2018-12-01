import * as PIXI from 'pixi.js';
import { C } from './constants';

/**
 * This will be the god object that holds all state. 
 *  
 * I hope so
 * 
 * Peter that means you
 */
export class State {
  graph: Node[];

  constructor() {
    this.graph = [];
  }
}

export class Game {
  renderer!: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  stage    : PIXI.Container;

  constructor(div: HTMLDivElement) {
    this.setUpPixiStuff(div);

    const sprite = new PIXI.Graphics();
    sprite.x = 0;
    sprite.y = 0;

    sprite.drawRect(0, 0, 25, 25);

    this.stage = new PIXI.Container();
    this.stage.addChild(sprite);

    const text = new PIXI.Text("Roguelike Dragon God Trail New Game Plus Simulator The Card Game 2");
    this.stage.addChild(text);
    text.x = 50;
    text.y = 50;

    this.animate();
  }

  private setUpPixiStuff(div: HTMLDivElement): void {
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