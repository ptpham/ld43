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
  stage: PIXI.Container;

  constructor(stage: PIXI.Container) {
    this.stage = stage;
  }
}

export class Game {
  renderer!: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  stage    : PIXI.Container;
  state    : State;

  constructor(div: HTMLDivElement) {
    this.setUpPixiStuff(div);


    const graphSprite = new PIXI.Graphics();
    for (let node of this.state.graph) {
      for (let neighbor of node.neighbors) {
        graphSprite.moveTo(node.position.x, node.position.y);
        graphSprite.lineTo(neighbor.position.x, neighbor.position.y);
      }
    }

    for (let node of this.state.graph) {
      graphSprite.drawCircle(node.position.x, node.position.y, 16);
    }
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

    this.state = new State(
      this.stage,
    );
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

    const loader = new PIXI.loaders.Loader();
    loader.add('test', 'assets/test.png');

    div.appendChild(this.renderer.view);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    this.renderer.render(this.stage);
  }
}