import * as PIXI from 'pixi.js';
import { C, Debug } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { IEntity } from './entity';
import { Location } from './location';
import { GameMap } from './gamemap';
import { EventOption, EventType, EventItem } from './events';
import { BlightManager } from './blightmanager';

export type IdolState = 
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
  items               : Set<EventItem>;
  cardsInCaravan      : Set<CardType>;
  cardsInWholeGame    : Set<CardType>;
  stage               : PIXI.Container;
  activeEvent         : EventType | undefined;
  graph               : Graph.Node[];
  visitedNodes        : Set<Graph.Node>;
  blightedNodes       : Set<Graph.Node> = new Set();
  river               : PIXI.Point[];
  canyon              : PIXI.Point[];
  caravanLocation     : Graph.Node;
  volcanoLocation     : Graph.Node;
  selectedNextLocation: Location | undefined;
  mousedOverLocation  : Location | undefined;
  isLocationDone      : boolean;
  meat                : number;
  walkAnimation?      : PIXI.ticker.Ticker;
  idolState           : IdolState;
  gameMap            !: GameMap;
  time                : { from_start: number, for_idol: number } = { from_start: 0, for_idol: 0 };
  blightManager       : BlightManager = new BlightManager();

  constructor(stage: PIXI.Container) {
    const graphOptions = {
      width: C.CANVAS_WIDTH - 100, // TODO(bowei): this should be MAP_WIDTH and MAP_HEIGHT once we get scrolling working
      height: C.CANVAS_HEIGHT - 100,
      spacing: 80
    };

    this.items = new Set();
    this.graph = Graph.generate(graphOptions);

    this.cardsInCaravan     = new Set();
    this.cardsInWholeGame   = new Set();
    this.mousedOverLocation = undefined;

    this.stage    = stage;
    this.entities = [];
    this.addEntity(this.blightManager);

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
          skill: "Woodsman",
          meat: 3,
        },
        {
          skill: "Assassin",
          meat: 1,
        },
        {
          skill: "Priest",
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
    if (this.idolState.state === 'carried') {
      // if it was newly picked up : remove the imminently blighted spots
      //this.blightManager.unRenderImminent();
    } else {
      // if it was newly dropped : figure out the imminently blighted spots
      //this.blightManager.renderImminent(this, this.idolState.node, this.time.for_idol)
      // before incrementing, check if we hit a blight application
      if (this.getIdolBlightDanger().remaining === 1) {
        //console.log("blight happens... maybe");
        this.blightManager.applyBlightAndRenderImminent(this, this.idolState.node, this.time.for_idol)
        this.time.for_idol++;
        // after incrementing, re-figure the imminent blight
      } else {
        this.time.for_idol++;
      }
    }
  }

  public getIdolBlightDanger(): { text: string, remaining: number} {
    return this.blightManager.getIdolBlightDanger(this.time.for_idol, this.idolState);
  }

  onDropIdol(): void {
    if (this.idolState.state === "carried") {
      this.idolState = {
        state: "dropped",
        node: this.caravanLocation,
      };
      this.blightManager.renderImminent(this, this.idolState.node, this.time.for_idol)
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
      this.blightManager.unRenderImminent();
    }

    this.triggerChange();
  }

  public hasIdol(): boolean {
    return this.idolState.state === "carried";
  }

  public handleChooseEventOption(option: EventOption): void {
    if (option.outcome) {
      const outcomes = 
        Array.isArray(option.outcome)
          ? option.outcome
          : [option.outcome]
          ;

      for (const outcome of outcomes) {
        switch (outcome.type) {
          case "gain-meat": {
            this.meat += outcome.amount;
            break;
          }

          case "lose-meat": {
            this.meat -= outcome.amount;
            break;
          }

          case "gain-item": {
            this.items.add(outcome.item);

            break;
          }

          default: {
            const x: never = outcome;

            throw new Error("expected x to be never! " + x);
          }
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
