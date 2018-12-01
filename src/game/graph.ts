
import { Line } from './lib/line';
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
  radiusSize?: number,
  spacing: number,
  width: number,
  height: number
}

export function candidateEdgeHasIntersection(nodes: Node[], first: Node, second: Node, radiusSize: number): boolean {
  let query = new Line({ one: first.position, two: second.position });
  for (let node of nodes) {
    if (node == first || node == second) continue;
    if (query.intersectCircle(node.position, radiusSize)) return true;

    for (let other of node.neighbors) {
      if (other == first || other == second) continue;
      let line = new Line({ one: node.position, two: other.position });
      if (query.intersectLine(line)) return true;
    }
  }


  return false;
}

export function generate(options: GenerateOptions): Node[] {
  let { width, height, spacing, radiusSize, iters = 1000, minAngle = Math.PI / 4 } = options;
  radiusSize = radiusSize || spacing/2;

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
    result.push(new Node(current, _.sample(LocationTypeNames)! as LocationType));
  }

  for (let i = 0; i < result.length; i++) {
    let first = result[i];

    outer:
    for (let j = 0; j < i; j++) {
      let second = result[j];
      let toSecond = second.position.subtract(first.position);
      if (first.position.distance(second.position) > 2*spacing) continue;
      
      for (let neighbor of first.neighbors) {
        let toNeighbor = neighbor.position.subtract(first.position);
        if (toSecond.angle(toNeighbor) < minAngle) {
          break outer;
        }
      }

      if (candidateEdgeHasIntersection(result, first, second, radiusSize)) continue;
      first.connect(second);
    }
  }

  let targetDegree = 3;
  for (let first of result) {
    let { neighbors } = first;
    if (neighbors.length > targetDegree) continue;

    let prohibit = [first, ...first.neighbors];
    let sorted = _.sortBy(_.difference(result, prohibit), second => first.position.distance(second.position))!;

    for (let i = 0; i < sorted.length && neighbors.length < targetDegree; i++) {
      if (candidateEdgeHasIntersection(result, first, sorted[i], radiusSize)) continue;
      first.connect(sorted[i]);
    }
  }

  return result;
}

