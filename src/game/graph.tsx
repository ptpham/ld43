
import React from "react";
import { C } from './constants';
import { Line } from './lib/line';
import { Point } from './lib/point';
import { LocationType, LocationTypeNames } from './data';
import _ from 'lodash';
import { State } from './state';

export class Node {
  // not counting disadvantages due to idol etc
  baseMeatCost!: number;

  neighbors: Node[] = [];
  upgraded: boolean = false;

  constructor(
    public position: Point, 
    public locationType: LocationType
  ) { }

  meatCost(state: State): number {
    return this.baseMeatCost! + (state.hasIdol() ? 1 : 0);
  }

  meatCostExplanationString(state: State): JSX.Element {
    let string = `${ this.baseMeatCost } (location)`

    if (state.hasIdol()) {
      string += ` + ${ C.IDOL_MEAT_COST } (idol burden)`;
    }

    return <>{ string }</>;
  }

  connect(other:Node) {
    other.neighbors.push(this);
    this.neighbors.push(other);
  }

  upgrade() {
    this.upgraded = true;
  }

  public equals(other: Node): boolean {
    return (
      this.position.x === other.position.x && 
      this.position.y === other.position.y
    );
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

  // Place initial node positions
  outer:
  for (let i = 0; i < iters; i++) {
    let current = new Point(width*Math.random(), height*Math.random());

    for (let { position } of result) {
      if (current.distance(position) < spacing) continue outer;
    }
    let validLocationTypeNames: string[] = LocationTypeNames
      .filter(x => 
        x !== 'Start' &&
        x !== 'Finish' &&
        x !== 'River' &&
        x !== 'Canyon'
      );
    result.push(new Node(current, _.sample(validLocationTypeNames)! as LocationType));
  }

  // Create nice edges between nodes
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

  // Try to get nodes to target degree
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

  for (const node of result) {
    node.baseMeatCost = _.random(1, 4, false);
  }

  return _.sortBy(result, (node) => { return node.position.y; });
}

export function generateSnake(nodes: Node[], type: LocationType, options: GenerateOptions): PIXI.Point[] {
  const { width, height } = options;
  const line = new Line({ x1: width * Math.random(), x2: width * Math.random(), y1: 0, y2: height });

  const snake = [new PIXI.Point(line.x1, line.y1)];
  nodes.forEach((node: Node) => {
    if (line.intersectCircle(node.position, C.NODE_RADIUS * 1.5)) {
      node.locationType = type;
      snake.push(new PIXI.Point(node.position.x, node.position.y));
    }
  });
  snake.push(new PIXI.Point(line.x2, line.y2));
  return snake;
}

