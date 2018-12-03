
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
  private sprite: PIXI.Sprite | undefined = undefined;

  constructor(props: {
    node: Node;
    state: State;
    visited: boolean;
  }) {
    super();

    const { node, state } = props;

    this.node = node;
    this.state = state;

    // add a sprite
    if (node.locationType == 'Start') {
      this.sprite = makeSprite(PIXI.loader.resources['grass'].texture);
    } else if (node.locationType == 'Finish') {
      // mount DOOM!
      this.sprite = makeSprite(PIXI.loader.resources['volcano'].texture);
      this.sprite.x *= 2;
      this.sprite.y *= 2;
      this.sprite.scale.x *= 2;
      this.sprite.scale.y *= 2;
      this.particles = new Particles(this, node.position.x, node.position.y - 32, 60, 'red_particle');
    } else if (node.locationType == 'Forest') {
      this.sprite = makeSprite(PIXI.loader.resources['forest'].texture);
    } else if (node.locationType == 'GoblinNest') {
      this.sprite = makeSprite(PIXI.loader.resources['goblin'].texture);
    } else if (node.locationType == 'Mountain') {
      this.sprite = makeSprite(PIXI.loader.resources['mountain'].texture);
    } else if (node.locationType == 'BarbarianVillage') {
      this.sprite = makeSprite(PIXI.loader.resources['barbarian'].texture);
    } else if (node.locationType == 'Desert') {
      this.sprite = makeSprite(PIXI.loader.resources['desert'].texture);
    } else if (node.locationType == 'Swamp') {
      this.sprite = makeSprite(PIXI.loader.resources['swamp'].texture);
    } else if (node.locationType == 'River' || node.locationType == 'Canyon') {
      this.sprite = makeSprite(PIXI.loader.resources['brokenbridge'].texture);
    }

    if (this.sprite) {
      this.addChild(this.sprite);

      this.sprite.x = node.position.x - this.sprite.width / 2;
      this.sprite.y = node.position.y - this.sprite.height / 2;

      (this.sprite as any).visited = props.visited;
    }

    this.interactive = true;
    this.hitArea = new PIXI.Circle(node.position.x, node.position.y, C.NODE_RADIUS);

    this.on('click', () => this.onClick());
    this.on('mouseover', () => this.mouseOver());
    this.on('mouseout', () => this.mouseOut());

    this.render();
  }

  mouseOver(): void {
    if (this.state.getGameMode() !== 'Moving On Map') {
      return;
    }

    this.mousedOver = true;
    this.state.mousedOverLocation = this;
    //this.particles = new Particles(this, this.node.position.x, this.node.position.y, 6);

    this.render();
  }

  mouseOut(): void {
    if (this.state.getGameMode() !== 'Moving On Map') {
      return;
    }

    this.mousedOver = false;
    this.state.mousedOverLocation = undefined;
    if (this.particles) {
      this.particles.emit = false;
    }

    this.render();
  }

  onClick(): void {
    if (this.state.getGameMode() !== 'Moving On Map') {
      return;
    }

    if (this.state.caravanLocation.neighbors.indexOf(this.node) > -1) {
      this.state.moveCaravan(this.node);
    }

    this.state.selectedNextLocation = undefined;

    this.render();
  }

  render(): void {
    this.clear();

    if (!this.sprite) { return; }

    if (!(this.sprite as any).visited) {
      if (this.mousedOver) {
        this.sprite.tint = 0x333333;
      } else {
        this.sprite.tint = 0x0;
      }
    } else {
      if (this.selected) {
        this.sprite.tint = 0xffff00;
      } else if (this.mousedOver) {
        this.sprite.tint = 0xdddddd;
      } else {
        this.sprite.tint = 0xffffff;
      }
    }
  }

  update(state: State): void {
    if (this.particles) {
      this.particles.update_(state);
    }
  }
}
