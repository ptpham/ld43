import * as PIXI from 'pixi.js';
import { C, Debug } from './constants';
import * as Graph from './graph';
import { CardType } from './data';
import { IEntity } from './entity';
import { Location } from './location';
import { GameMap } from './gamemap';
import { EventOption, EventType, EventItem } from './eventDefinition';
import { IdolBlightDanger, BlightManager } from './blightmanager';

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
  | "Choosing Characters"
  | "Moving On Map"
  | "Looking At Event"
  | "Ending";

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
  hasWon              : boolean;
  choosingCharacters  : boolean;
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
  lastCaravanLocation : Graph.Node;
  caravanLocation     : Graph.Node;
  volcanoLocation     : Graph.Node;
  hometownLocation    : Graph.Node;
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
      height: C.CANVAS_HEIGHT - 200, // Leave some room for ui
      spacing: 80
    };

    this.hasWon = false;
    this.choosingCharacters = Debug.AUTO_CHOOSE_CARAVAN ? false : true;

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

    this.graph = Graph.addLocationBasedData(this.graph, C.CANVAS_WIDTH);

    this.caravanLocation = this.graph.find(node => node.locationType === 'Start')!;
    this.hometownLocation = this.caravanLocation;
    this.volcanoLocation = this.graph.find(node => node.locationType === 'Finish')!;
    this.lastCaravanLocation = this.caravanLocation;

    this.isLocationDone = false;

    // Fog of war stuff

    this.visitedNodes = new Set();

    this.visitedNodes.add(this.caravanLocation);
    this.visitedNodes.add(this.volcanoLocation);

    // Resource stuff

    this.meat     = C.STARTING_MEAT;

    // Idol stuff 

    this.idolState = {
      state: "carried",
    };

    // cards

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
      this.cardsInWholeGame = new Set(
        [
          { skill: "Architect"      , meat: 1, },
          { skill: "Cartographer"   , meat: 1, },
          { skill: "Sage"           , meat: 1, },
          { skill: "Merchant"       , meat: 1, },
          { skill: "Bard"           , meat: 1, },
          { skill: "Fool"           , meat: 1, },
        ] as CardType[]
      );
    } else {
      this.cardsInWholeGame = new Set(
        [
          { skill: "Woodsman"       , meat: 1, },
          { skill: "Priest"         , meat: 1, },
          { skill: "Assassin"       , meat: 1, },
          { skill: "Architect"      , meat: 1, },
          { skill: "Cartographer"   , meat: 1, },
          { skill: "Sage"           , meat: 1, },
          { skill: "Merchant"       , meat: 1, },
          { skill: "Bard"           , meat: 1, },
          { skill: "Fool"           , meat: 1, },
        ] as CardType[]
      );
    }

  }
  
  getGameMode(): GameMode {
    if (this.hasWon) {
      return "Ending";
    }

    if (this.activeEvent) {
      return "Looking At Event";
    }

    if (this.choosingCharacters) {
      return "Choosing Characters";
    }

    return "Moving On Map";
  }

  addEntity(entity: IEntity): void {
    this.entities.push(entity);
  }

  moveCaravan(to: Graph.Node, retreat = false): void {
    // mark current node's event as seen, so we dont have to see it again
    // if it's something trivial.

    if (!retreat) {
      this.lastCaravanLocation = this.caravanLocation;
    }

    this.caravanLocation = to;
    this.isLocationDone = false;

    this.visitedNodes.add(to);
    this.gameMap.graphSprite.render();

    if (!to.eventSeen) {
      this.activeEvent = to.event;
    }

    this.time.from_start++;

    if (this.idolState.state === 'carried' || this.hasWon) {
    } else {
      // before incrementing, check if we hit a blight application
      if (this.getIdolBlightDanger().remaining === 1) {
        this.blightManager.applyBlightAndRenderImminent(this, this.idolState.node, this.time.for_idol)
      }
      this.time.for_idol++;
    }
  }

  public getIdolBlightDanger(): IdolBlightDanger {
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

  public canPickUpIdol(): boolean {
    return !this.hasWon &&
      this.idolState.state === "dropped" &&
      this.idolState.node.equals(this.caravanLocation);
  }

  public canChangeParty(): boolean {
    return this.hometownLocation.equals(this.caravanLocation);
  }

  public onRequestChangeParty(): void {
    this.isLocationDone = false;
    this.choosingCharacters = true;
    this.triggerChange();
  }

  public handleChooseEventOption(option: EventOption): void {
    let newCaravanLocation = this.caravanLocation;
    let swapLocation = false;

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

          case "lose-item": {
            this.items.delete(outcome.item);

            break;
          }

          case "turn-back": {
            newCaravanLocation = this.lastCaravanLocation;

            break;
          }

          case "lose-member-strong": {
            for (let c of this.cardsInCaravan) {
              if (c.skill == outcome.skill) {
                this.cardsInCaravan.delete(c);
                break;
              }
            }
            break;
          }

          case "lose-member-weak": {
            let c: CardType | undefined;
            for (c of this.cardsInCaravan) {
              if (c.skill == outcome.skill) {
                this.cardsInCaravan.delete(c);
                break;
              }
            }
            // add him back home
            if (c) {
              this.cardsInWholeGame.add(c);
            }

            break;
          }

          case "end-run": {
            // drop the idol
            this.onDropIdol();

            // put all cards back at hometown

            const cards = this.cardsInCaravan.keys();

            this.cardsInCaravan = new Set();

            for (const card of cards) {
              this.cardsInWholeGame.add(card);
            }

            // move player back home too
            swapLocation = true;
            newCaravanLocation = this.hometownLocation;
            this.meat = C.STARTING_MEAT;
            this.choosingCharacters = true;
            this.isLocationDone = false;

            break;
          }

          default: {
            const x: never = outcome;

            throw new Error("expected x to be never! " + x);
          }
        }
      }
    }

    // We mark the event as done if it's just a "pass on" event
    // with no additional options (which it should be if there's
    // only one option with no outcomes), and it didn't update itself.

    if (
      this.caravanLocation.event &&
      this.caravanLocation.event.options.length === 1 &&
      this.caravanLocation.event.options[0].outcome.length === 0 &&
      !option.updateEventTo
    ) {
      this.caravanLocation.eventSeen = true;
    }

    if (option.updateEventTo) {
      this.caravanLocation.event = option.updateEventTo;
    }

    if (
      newCaravanLocation === this.caravanLocation &&
      this.caravanLocation.event && this.caravanLocation.event.stopsProgress) {
      newCaravanLocation = this.lastCaravanLocation;
    }

    if (option.winsGame) {
      this.winGame();
    }

    if (newCaravanLocation !== this.caravanLocation) {
      if (swapLocation) {
        this.caravanLocation = newCaravanLocation;
      } else {
        this.moveCaravan(
          newCaravanLocation,
          true
        );
      }
    }

    this.activeEvent = undefined;
    this.triggerChange();
  }

  winGame() {
    this.hasWon = true;
    this.onDropIdol();
    this.visitedNodes = new Set(this.graph);
    this.blightManager.unRenderImminent();

    this.gameMap.graphSprite.render();
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
