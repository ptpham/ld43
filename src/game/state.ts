import * as PIXI from 'pixi.js';
import { C } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { IEntity } from './entity';

/**
 * This will be the god object that holds all state. 
 *  
 * I hope so
 * 
 * Peter that means you
 * Grant I will push you into the volcano.
 *
 */

export class State {
  /**
   * Keeps track of all entities in the game. 
   * 
   * They will be automatically updated and stuff
   */
  entities        : IEntity[];
  active_caravan  : CardType[] = [];    
  hasIdol         : boolean;
  stage           : PIXI.Container;
  graph           : Graph.Node[];
  caravan_location: Graph.Node;
  isLocationDone  : boolean;
  meat            : number;
  walkAnimation?  : PIXI.ticker.Ticker;

  constructor(stage: PIXI.Container) {
    this.hasIdol  = true;
    this.stage    = stage;
    this.meat     = 50;
    this.entities = [];
    this.graph    = Graph.generate({ 
      width  : C.CANVAS_WIDTH - 100, // TODO(bowei): this should be MAP_WIDTH and MAP_HEIGHT once we get scrolling working
      height : C.CANVAS_HEIGHT - 100,
      spacing: 48
    });
    this.caravan_location = this.graph[0];
    this.isLocationDone = false;
  }

  addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  onDropIdol(): void {
    this.hasIdol = false;
  }

  onPickUpIdol(): void {

  }
}
