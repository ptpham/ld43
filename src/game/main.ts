import * as PIXI from 'pixi.js';
import { C } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { GameMap } from './map';

/**
 * This will be the god object that holds all state. 
 *  
 * I hope so
 * 
 * Peter that means you
 */
export class State {
  active_caravan: CardType[] = [];    
  stage         : PIXI.Container;
  graph         : Graph.Node[];

  constructor(stage: PIXI.Container) {
    this.stage = stage;
    this.graph = Graph.generate({ 
      width: C.CANVAS_WIDTH - 100, // TODO(bowei): this should be MAP_WIDTH and MAP_HEIGHT once we get scrolling working
      height: C.CANVAS_HEIGHT - 100,
      spacing: 48
    });
  }
}

export class Game {
  stage   !: PIXI.Container;
  state   !: State;
  renderer!: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

  constructor(div: HTMLDivElement) {
    this.setUpPixiStuff(div);

    const loader = new PIXI.loaders.Loader();
    loader.add('test', 'assets/test.png');
    loader.load(() => this.start());
  }

  private start(): void {
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

    this.animate();

    this.state = new State(
      this.stage,
    );

    new GameMap(this.state);
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