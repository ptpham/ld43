
import { Rect } from "./rect";
import { C } from "../constants";
import { State } from "../state";

export class Camera {
  width: number;
  height: number;

  desiredStageX = 0;
  desiredStageY = 0;

  bounds: Rect;

  get x(): number {
    return this.centerX - this.width / 2;
  }

  get right(): number {
    return this.centerX + this.width / 2;
  }

  get y(): number {
    return this.centerY - this.height / 2;
  }

  get bottom(): number {
    return this.centerY + this.height / 2;
  }

  setX(value: number) {
    if (value < this.bounds.x) { value = this.bounds.x; }
    if (value >= this.bounds.right - this.width) { value = this.bounds.right - this.width; }

    this.desiredStageX = -value;
  }

  setY(value: number) {
    if (value < this.bounds.y) { value = this.bounds.y; }
    if (value >= this.bounds.bottom - this.height) { value = this.bounds.bottom - this.height; }

    this.desiredStageY = -value;
  }

  set centerX(value: number) {
    this.setX(value - this.width / 2);
  }

  get centerX(): number {
    return -this.desiredStageX + this.width / 2;
  }

  set centerY(value: number) {
    this.setY(value - this.height / 2);
  }

  get centerY(): number {
    return -this.desiredStageY + this.height / 2;
  }

  constructor() {
    this.width  = C.CANVAS_WIDTH;
    this.height = C.CANVAS_HEIGHT;

    this.bounds = new Rect({ 
      x: 0, 
      y: 0, 
      w: C.MAP_WIDTH,
      h: C.MAP_HEIGHT,
    });
  }

  update(state: State) {
    state.stage.x = this.desiredStageX;
    state.stage.y = this.desiredStageY;
  }
}
