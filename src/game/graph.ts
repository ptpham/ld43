
import { Point } from './lib/point';
import { LocationType, LocationTypeNames } from './data';
import _ from 'lodash';

export class Node {
  neighbors: Node[] = [];
  constructor(public position: Point, public locationType: LocationType) { }
}

export type GenerateOptions = {
  iters?: number,
  minAngle?: number,
  spacing: number,
  width: number,
  height: number
}

export function generateGraph(options: GenerateOptions): Node[] {
  let { width, height, spacing, iters = 1000, minAngle = Math.PI / 4 } = options;
  let result: Node[] = [
    new Node(new Point(spacing, height / 2), "Start"),
    new Node(new Point(width - spacing, height / 2), "Finish")
  ];

  for (let i = 0; i < iters; i++) {
    let current = new Point(width*Math.random(), height*Math.random());

    for (let { position } of result) {
      if (current.distance(position) < spacing) {
        result.push(new Node(current, _.sample(LocationTypeNames)! as LocationType));
      }
    }
  }

  for (let first of result) {
    for (let second of result) {
      let toSecond = second.position.subtract(first.position);
      if (first.distance(second) < 2*spacing) continue;
      
      for (let neighbor of first.neighbors) {
        let toNeighbor = neighbor.position.subtract(first.position);
        if (toSecond.angle(toNeighbor) > minAngle) {
          first.neighbors.push(second);
          second.neighbors.push(first);
        }
      }
    }
  }

  return result;
}

