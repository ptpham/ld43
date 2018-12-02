import * as PIXI from 'pixi.js';
import { C, Debug } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { IEntity } from './entity';
import { GameMapCircle, GameMap } from './gamemap';
import { EventOption, EventType } from './events';

type IdolState = 
  | {
      state: "carried";
    }
  | {
      state : "dropped";
      node  : Graph.Node;
    }
  ;

export type GameMode = 
  | "Moving On Map"
  | "Looking At Event"

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
  activeEvent         : EventType | undefined;
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
  time                : { from_start: number, for_idol: number } = { from_start: 0, for_idol: 0 };

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
  
  getGameMode(): GameMode {
    if (this.activeEvent) {
      return "Looking At Event";
    }

    return "Moving On Map";
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

    this.activeEvent = to.event;
    this.time.from_start++;
    if (this.idolState.state === 'dropped') {
      this.time.for_idol++;
    }
  }

  public getIdolBlightDanger(): { text: string, remaining: number} {
    let t = this.time.for_idol;
    if (t <= 10) {
      return { text: "Minimal", remaining: 10 - t };
      //return "Minimal";
    } else if (t <= 20) {
      //return "Low";
      return { text: "Low", remaining: 20 - t };
    } else if (t <= 30) {
      //return "Medium";
      return { text: "Medium", remaining: 30 - t };
    } else if (t <= 40) {
      //return "High";
      return { text: "High", remaining: 40 - t };
    } else {
      //return "Catastrophic";
      return { text: "Catastrophic", remaining: t % 2 };
    }
  }

  onDropIdol(): void {
    if (this.idolState.state === "carried") {
      this.idolState = {
        state: "dropped",
        node: this.caravanLocation,
      };
    }

    this.triggerChange();
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

    this.triggerChange();
  }

  public hasIdol(): boolean {
    return this.idolState.state === "carried";
  }

  public handleChooseEventOption(option: EventOption): void {
    if (option.outcome) {
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

    if (option.updateEventTo) {
      this.caravanLocation.event = option.updateEventTo;
    }

    this.activeEvent = undefined;
    this.triggerChange();
  }

  // stupid stuff to ensure we always propagate changes to react.

  changeListeners: ((state: State) => void)[] = [];

  addChangeListener(e: (state: State) => void) {
    this.changeListeners.push(e);
  }

  triggerChange(): void {
    for (const listener of this.changeListeners) {
      listener(this);
    }
  }
}
