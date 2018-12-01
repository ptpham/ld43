
import { Entity, IEntity } from "./entity";
import { State } from "./state";
import { Node } from "./graph";

import { C } from "./constants";
import { Caravan } from "./caravan";

export class GameMap extends Entity {
  state: State;

  constructor(state: State) {
    super();

    this.state = state;

    const graphSprite = new PIXI.Graphics();
    graphSprite.lineWidth = 1;
    graphSprite.lineStyle(1, 0x000000)

    for (let node of this.state.graph) {
      for (let neighbor of node.neighbors) {
        graphSprite.moveTo(node.position.x, node.position.y);
        graphSprite.lineTo(neighbor.position.x, neighbor.position.y);
      }
    }

    for (let node of this.state.graph) {
      const newCircle = new GameMapCircle(node, state);

      graphSprite.addChild(newCircle);
      state.addEntity(newCircle);
    }

    graphSprite.x = 50;
    graphSprite.y = 50;

    state.stage.addChild(graphSprite);

    // add caravan

    const startNode = this.state.graph.filter(x => x.locationType === "Start")[0];

    const caravan = new Caravan();
    caravan.x = startNode.position.x;
    caravan.y = startNode.position.y;

    state.addEntity(caravan);

    graphSprite.addChild(caravan);
  }

  update(state: State) {
    // update some circles
  }
}

export class GameMapCircle extends PIXI.Graphics implements IEntity {
  public node: Node;
  public state: State;
  public selected: boolean = false;

  constructor(node: Node, state: State) {
    super();
    this.node = node;
    this.state = state;

    // add a sprite
    if (node.locationType == 'Start') {
      // caravan starts here

      this.addChild(this.renderSprite(PIXI.loader.resources['grass'].texture,
        node.position.x,
        node.position.y,
      ));

    } else if (node.locationType == 'Finish') {
      // mount DOOM!
      this.addChild(this.renderSprite(PIXI.loader.resources['volcano'].texture,
        node.position.x,
        node.position.y,
      ));
    }

    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, 16);

    this.on('click', (e: PIXI.interaction.InteractionEvent) => this.onClick(e));

    this.render();
  }

  onClick(e: PIXI.interaction.InteractionEvent): void {
    // can only select nodes adjacent to current caravan location
    if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
      this.selected = !this.selected;

      if (!this.selected) {
        // we just double clicked this node
        // TODO in theory we should propagate this up a level
        this.state.caravan_location = this.node;
      }
    }

    this.render();
  }

  render(): void {
    this.clear();

    this.lineWidth = this.selected ? 3 : 1;

    if (this.node.locationType === 'Start') {
      this.lineStyle(this.lineWidth, 0x00FF00);
    } else if (this.node.locationType === 'Finish') {
      this.lineStyle(this.lineWidth, 0xFF0000);
      this.lineWidth = 0;
    } else {
      this.lineStyle(this.lineWidth, 0x000000);
    }

    this.drawCircle(this.node.position.x, this.node.position.y, 16);
  }

  private renderSprite(texture: PIXI.Texture, x: number, y: number): PIXI.Sprite {
    const sprite = new PIXI.Sprite(texture);
    sprite.x = x - sprite.width * C.FG_SPRITE_SCALE / 2;
    sprite.y = y - sprite.height * C.FG_SPRITE_SCALE / 2;
    sprite.scale = new PIXI.Point(C.FG_SPRITE_SCALE, C.FG_SPRITE_SCALE);
    return sprite;
  }

  update(state: State): void {
  }
}
