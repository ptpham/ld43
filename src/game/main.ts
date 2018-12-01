import * as PIXI from 'pixi.js';
import { C } from './constants';
import * as Graph from './graph';
import { CardType } from './data';

/**
 * This will be the god object that holds all state. 
 *  
 * I hope so
 * 
 * Peter that means you
 */
export class State {
  active_caravan: CardType[];    
  stage: PIXI.Container;
  graph: Graph.Node[];

  constructor(stage: PIXI.Container) {
    this.stage = stage;
    this.graph = Graph.generate({ width: 600, height: 100, spacing: 10 });
  }
}

class Game {
  stage   !: PIXI.Container;
  state   !: State;

  constructor(div: HTMLDivElement) {
    this.setUpPixiStuff(div);

    const loader = new PIXI.loaders.Loader();
    loader.add('test', 'assets/test.png');
    loader.load(() => this.start());
  }

  private start(): void {
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