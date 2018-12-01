
import { Point } from './lib/point';
import { LocationType, LocationTypeNames } from './data';
import _ from 'lodash';

export class Node {
  neighbors: Node[] = [];
  constructor(public position: Point, public locationType: LocationType) { }

  connect(other:Node) {
    other.neighbors.push(this);
    this.neighbors.push(other);
  }
}

export type GenerateOptions = {
  iters?: number,
  minAngle?: number,
  spacing: number,
  width: number,
  height: number
}

export function generate(options: GenerateOptions): Node[] {
  let { width, height, spacing, iters = 1000, minAngle = Math.PI / 4 } = options;
  let result: Node[] = [
    new Node(new Point(spacing, height / 2), "Start"),
    new Node(new Point(width - spacing, height / 2), "Finish")
  ];

  outer:
  for (let i = 0; i < iters; i++) {
    let current = new Point(width*Math.random(), height*Math.random());

    for (let { position } of result) {
      if (current.distance(position) < spacing) continue outer;
    }
    let validLocationTypeNames: string[] = LocationTypeNames.filter(x => x !== 'Start' && x !== 'Finish');
    result.push(new Node(current, _.sample(validLocationTypeNames)! as LocationType));
  }

  for (let first of result) {
    outer:
    for (let second of result) {
      let toSecond = second.position.subtract(first.position);
      if (first.position.distance(second.position) > 2*spacing) continue;
      
      for (let neighbor of first.neighbors) {
        let toNeighbor = neighbor.position.subtract(first.position);
        if (toSecond.angle(toNeighbor) < minAngle) {
          break outer;
        }
      }

      first.connect(second);
    }
  }

  let targetDegree = 3;
  for (let first of result) {
    let currentCount = first.neighbors.length;
    if (currentCount > targetDegree) continue;

    let prohibit = [first, ...first.neighbors];
    let sorted = _.sortBy(_.difference(result, prohibit), second => first.position.distance(second.position))!;

    for (let i = 0; i < targetDegree - currentCount; i++) {
      first.connect(sorted[i]);
    }
  }

  return result;
}

