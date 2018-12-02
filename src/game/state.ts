import * as PIXI from 'pixi.js';
import { C, Debug } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { IEntity } from './entity';
import { GameMapCircle, GameMap } from './gamemap';
import { EventOption } from './events';

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
  visitedNodes        : Set<Graph.Node>;
  river               : PIXI.Point[];
  canyon              : PIXI.Point[];
  caravanLocation     : Graph.Node;
  volcanoLocation     : Graph.Node;
  selectedNextLocation: GameMapCircle | undefined;
  mousedOverLocation  : GameMapCircle | undefined;
  isLocationDone      : boolean;
  meat                : number;
  walkAnimation?      : PIXI.ticker.Ticker;
  idolState           : IdolState;
  gameMap            !: GameMap;

  constructor(stage: PIXI.Container) {
    const graphOptions = {
      width: C.CANVAS_WIDTH - 100, // TODO(bowei): this should be MAP_WIDTH and MAP_HEIGHT once we get scrolling working
      height: C.CANVAS_HEIGHT - 100,
      spacing: 48
    };

    this.graph = Graph.generate(graphOptions);

    this.cardsInCaravan     = new Set();
    this.cardsInWholeGame   = new Set();
    this.mousedOverLocation = undefined;

    this.stage    = stage;
    this.entities = [];

    this.river = Graph.generateRiver(this.graph, graphOptions);
    this.canyon = Graph.generateCanyon(this.graph, graphOptions, this.river);

    this.caravanLocation = this.graph.find(node => node.locationType === 'Start')!;
    this.volcanoLocation = this.graph.find(node => node.locationType === 'Finish')!;
    this.isLocationDone = false;

    // Fog of war stuff

    this.visitedNodes = new Set();

    this.visitedNodes.add(this.caravanLocation);
    this.visitedNodes.add(this.volcanoLocation);

    // Resource stuff

    this.meat     = 50;

    // Idol stuff 

    this.idolState = {
      state: "carried",
    };

    if (Debug.AUTO_CHOOSE_CARAVAN) {
      this.cardsInCaravan = new Set([
        {
          skill: "WoodCutter",
          meat: 3,
        },
        {
          skill: "Priest",
          meat: 7,
        },
        {
          skill: "Assassin",
          meat: 1,
        },
      ] as CardType[]);

      this.isLocationDone = true;
    }
  }

  addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  moveCaravan(to: Graph.Node): void {
    this.caravanLocation = to;
    this.isLocationDone = false;

    this.meat -= to.meatCost(this);

    this.visitedNodes.add(to);
    this.gameMap.graphSprite.render();
  }

  onDropIdol(): void {
    if (this.idolState.state === "carried") {
      this.idolState = {
        state: "dropped",
        node: this.caravanLocation,
      };
    }

    this.onChange();
  }

  onPickUpIdol(): void {
    if (
      this.idolState.state === "dropped" &&
      this.caravanLocation.equals(this.idolState.node)
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

  public handleChooseEventOption(option: EventOption): void {
    switch (option.outcome.type) {
      case "gain-meat": {
        this.meat += option.outcome.amount;
        break;
      }

      case "lose-meat": {
        this.meat -= option.outcome.amount;
        break;
      }

      default: {
        const x: never = option.outcome;

        throw new Error("expected x to be never! " + x);
      }
    }
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
