import * as PIXI from 'pixi.js';
import { C } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { IEntity } from './entity';
import { GameMapCircle } from './gamemap';

type IdolState = 
  | {
      state: "carried";
    }
  | {
      state : "dropped";
      node  : Graph.Node;
    }
  ;

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
  entities            : IEntity[];
  cardsInCaravan      : Set<CardType>;
  cardsInWholeGame    : Set<CardType>;
  stage               : PIXI.Container;
  graph               : Graph.Node[];
  river               : PIXI.Point[];
  canyon              : PIXI.Point[];
  caravan_location    : Graph.Node;
  selectedNextLocation: GameMapCircle | undefined;
  mousedOverLocation  : GameMapCircle | undefined;
  isLocationDone      : boolean;
  meat                : number;
  walkAnimation?      : PIXI.ticker.Ticker;
  idolState           : IdolState;

  constructor(stage: PIXI.Container) {
    this.cardsInCaravan = new Set();
    this.cardsInWholeGame = new Set();

    this.stage    = stage;
    this.entities = [];

    const graphOptions = {
      width: C.CANVAS_WIDTH - 100, // TODO(bowei): this should be MAP_WIDTH and MAP_HEIGHT once we get scrolling working
      height: C.CANVAS_HEIGHT - 100,
      spacing: 48
    };
    this.graph = Graph.generate(graphOptions);
    this.river = Graph.generateSnake(this.graph, 'River', graphOptions);
    this.canyon = Graph.generateSnake(this.graph, 'Canyon', graphOptions);

    this.caravan_location = this.graph.find(node => node.locationType === 'Start')!;
    this.isLocationDone = false;

    // Resource stuff

    this.meat     = 50;

    // Idol stuff 

    this.idolState = {
      state: "carried",
    };
  }

  addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  moveCaravan(to: Graph.Node): void {
    this.caravan_location = to;
    this.isLocationDone = false;

    this.meat -= to.meatCost(this);
  }

  onDropIdol(): void {
    if (this.idolState.state === "carried") {
      this.idolState = {
        state: "dropped",
        node: this.caravan_location,
      };
    }

    this.onChange();
  }

  onPickUpIdol(): void {
    if (
      this.idolState.state === "dropped" &&
      this.caravan_location.equals(this.idolState.node)
      ) {
      this.idolState = {
        state: "carried",
      };
    }

    this.onChange();
  }

  public hasIdol(): boolean {
    return this.idolState.state === "carried";
  }


  // stupid stuff to ensure we always propagate changes to react.

  changeListeners: ((state: State) => void)[] = [];

  addChangeListener(e: (state: State) => void) {
    this.changeListeners.push(e);
  }

  onChange(): void {
    for (const listener of this.changeListeners) {
      listener(this);
    }
  }
}
