
import * as PIXI from 'pixi.js';
import { C } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { GameMapCircle } from './gamemap';

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
  active_caravan: CardType[] = [];    
  stage         : PIXI.Container;
  graph         : Graph.Node[];
  caravan_location: Graph.Node;
  caravan_location_graphix!: GameMapCircle;
  isLocationDone: boolean;

  constructor(stage: PIXI.Container) {
    this.stage = stage;
    this.graph = Graph.generate({ 
      width: C.CANVAS_WIDTH - 100, // TODO(bowei): this should be MAP_WIDTH and MAP_HEIGHT once we get scrolling working
      height: C.CANVAS_HEIGHT - 100,
      spacing: 48
    });
    this.caravan_location = this.graph[0];
    this.isLocationDone = false;
  }
}


