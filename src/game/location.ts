
import { IEntity } from "./entity";
import { State } from "./state";
import { Node } from "./graph";

import { C } from "./constants";
import { Particles } from "./particles";
import { makeSprite } from "./lib/sprite";

export class Location extends PIXI.Graphics implements IEntity {
  public node: Node;
  public state: State;
  public selected: boolean = false;
  public particles: Particles | undefined;

  private mousedOver = false;

  constructor(props: {
    node: Node;
    state: State;
  }) {
    super();

    const { node, state } = props;

    this.node = node;
    this.state = state;

    let sprite: PIXI.Sprite | undefined = undefined;

    // add a sprite
    if (node.locationType == 'Start') {
      sprite = makeSprite(PIXI.loader.resources['grass'].texture);
    } else if (node.locationType == 'Finish') {
      // mount DOOM!
      sprite = makeSprite(PIXI.loader.resources['volcano'].texture);
      sprite.x *= 2;
      sprite.y *= 2;
      sprite.scale.x *= 2;
      sprite.scale.y *= 2;
      this.particles = new Particles(this, node.position.x, node.position.y - 32, 60, 'red_particle');
    } else if (node.locationType == 'Forest') {
      sprite = makeSprite(PIXI.loader.resources['forest'].texture);
    } else if (node.locationType == 'GoblinNest') {
      sprite = makeSprite(PIXI.loader.resources['goblin'].texture);
    } else if (node.locationType == 'Mountain') {
      sprite = makeSprite(PIXI.loader.resources['mountain'].texture);
    } else if (node.locationType == 'BarbarianVillage') {
      sprite = makeSprite(PIXI.loader.resources['barbarian'].texture);
    } else if (node.locationType == 'Desert') {
      sprite = makeSprite(PIXI.loader.resources['desert'].texture);
    } else if (node.locationType == 'Swamp') {
      sprite = makeSprite(PIXI.loader.resources['swamp'].texture);
    }


    if (sprite) {
      this.addChild(sprite);

      sprite.x = node.position.x - sprite.width / 2;
      sprite.y = node.position.y - sprite.height / 2;
    }

    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, C.NODE_RADIUS);

    this.on('click', () => this.onClick());
    this.on('mouseover', () => this.mouseOver());
    this.on('mouseout', () => this.mouseOut());

    this.render();
  }

  mouseOver(): void {
    this.mousedOver = true;
    this.state.mousedOverLocation = this;
    //this.particles = new Particles(this, this.node.position.x, this.node.position.y, 6);

    this.render();
  }

  mouseOut(): void {
    this.mousedOver = false;
    this.state.mousedOverLocation = undefined;
    if (this.particles) {
      this.particles.emit = false;
    }

    this.render();
  }

  onClick(): void {
    //if (this.state.caravan_location.neighbors.indexOf(this.node) > -1) {
    if (true) {
      if (this.selected) {
        this.selected = false;
        // we just double clicked this node
        // can only select nodes adjacent to current caravan location to move caravan to

        if (this.state.caravanLocation.neighbors.indexOf(this.node) > -1) {
          this.state.moveCaravan(this.node);
        }

        this.state.selectedNextLocation = undefined;
      } else {
        // unselect the other guy
        let lastLocation = this.state.selectedNextLocation;
        if (lastLocation) {
          lastLocation.selected = false;
          lastLocation.render();
        }
        this.state.selectedNextLocation = this;
        this.selected = true;
      }

      this.render();
    }
  }

  render(): void {
    this.clear();

    if (this.selected) {
      for (const child of this.children) {
        (child as any).tint = 0xffff00;
      }
    } else if (this.mousedOver) {
      for (const child of this.children) {
        (child as any).tint = 0xdddddd;
      }
    } else {
      for (const child of this.children) {
        (child as any).tint = 0xffffff;
      }
    }
  }

  update(state: State): void {
    if (this.particles) {
      this.particles.update_(state);
    }
  }
}
