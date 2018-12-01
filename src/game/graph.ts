
import { Point } from 'pixi.js';
import { LocationType, LocationTypeNames } from './data';
import _ from 'lodash';

export class Node {
  neighbors: Node[] = [];
  constructor(public position: Point, public locationType: LocationType) { }
}

export function generateGraph(width: number, height: number, spacing: number, maxIters: number = 1000): Node[] {
  let result: Node[] = [
    new Node(new Point(spacing, height / 2), "Start"),
    new Node(new Point(width - spacing, height / 2), "Finish")
  ];

  for (let i = 0; i < maxIters; i++) {
    let x: number = Math.random();
    let y: number = Math.random();

    for (let { position } of result) {
      let distance = Math.sqrt((position.x - x) ** 2 + (position.y - y) ** 2);
      if (distance < spacing) result.push(new Node(new Point(x, y), _.sample(LocationTypeNames)! as LocationType));
    }


  }

  return result;
}

