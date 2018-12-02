
import { C, SeedRandom, Sample } from './constants';
import { Line } from './lib/line';
import { Point } from './lib/point';
import { LocationType, LocationTypeNames } from './data';
import _ from 'lodash';
import { EventType, AllEvents, EventDifficulty } from "./events";

export class Node {
  // not counting disadvantages due to idol etc
  neighbors    : Node[] = [];
  upgraded     : boolean = false;
  event        : EventType | undefined;
  eventSeen    : boolean;

  constructor(
    public position: Point, 
    public locationType: LocationType,
  ) { 
    this.eventSeen = false;
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

export function connectSingleNodeCloseTo(nodes: Node[], target: Node) {
  let sorted = _.sortBy(nodes, node => node.position.distance(target.position));
  sorted[0].connect(target);
  return sorted[0];
}

export function generate(options: GenerateOptions): Node[] {
  let { width, height, spacing, radiusSize, iters = 1000, minAngle = Math.PI / 4 } = options;
  radiusSize = radiusSize || spacing/2;

  let finish = 
    new Node(new Point(width - spacing, height / 2), "Finish");

  let result: Node[] = [
    new Node(new Point(spacing, height / 2), "Start"),
    finish
  ];

  // Place initial node positions
  outer:
  for (let i = 0; i < iters; i++) {
    let current = new Point(width*SeedRandom(), height*SeedRandom());

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
    result.push(new Node(current, Sample(validLocationTypeNames) as LocationType));
  }

  // Create gauntlet toward the end
  let GAUNTLET_SIZE = 3;
  let gauntlet = [finish];
  for (let i = 0; i < GAUNTLET_SIZE; i++) {
    let created = connectSingleNodeCloseTo(_.difference(result, gauntlet), _.last(gauntlet)!);
    gauntlet.push(created);
  }
  let gauntletProhibitSet = new Set(gauntlet.slice(0, -1));

  // Create nice edges between nodes
  for (let i = 0; i < result.length; i++) {
    let first = result[i];
    if (gauntletProhibitSet.has(first)) continue;

    outer:
    for (let j = 0; j < i; j++) {
      let second = result[j];
      if (gauntletProhibitSet.has(second)) continue;

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
    if (gauntletProhibitSet.has(first)) continue;

    let prohibit = [first, ...first.neighbors];
    let sorted = _.sortBy(_.difference(result, prohibit), second => first.position.distance(second.position))!;

    for (let i = 0; i < sorted.length && neighbors.length < targetDegree; i++) {
      if (gauntletProhibitSet.has(sorted[i])) continue;
      if (candidateEdgeHasIntersection(result, first, sorted[i], radiusSize)) continue;
      first.connect(sorted[i]);
    }
  }

  return _.sortBy(result, (node) => { return node.position.y; });
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

export function generateRiver(nodes: Node[], options: GenerateOptions): PIXI.Point[] {
  const { width, height } = options;
  const line = new Line({ x1: width * SeedRandom(), x2: width * SeedRandom(), y1: -64, y2: height + 64 });

  const snake = [new PIXI.Point(line.x1, line.y1)];
  nodes.forEach((node: Node) => {
    if (node.locationType === 'Start' || node.locationType === 'Finish') {
      return;
    }
    if (line.intersectCircle(node.position, C.NODE_RADIUS * 2)) {
      node.locationType = 'River';
      snake.push(new PIXI.Point(node.position.x, node.position.y));
    }
  });
  snake.push(new PIXI.Point(line.x2, line.y2));
  return snake;
}

export function generateCanyon(nodes: Node[], options: GenerateOptions, split: PIXI.Point[]): PIXI.Point[] {
  const { width, height } = options;
  
  let w = 3 * width / 5;
  let x = 0;
  const splitX = split[0].x;
  if (splitX < width / 2) {
    x = width / 2;
  }
  const line = new Line({
    x1: x + w * SeedRandom(),
    x2: x + w * SeedRandom(),
    y1: height * SeedRandom(),
    y2: height * SeedRandom()
  });

  const snake = [new PIXI.Point(line.x1, line.y1)];
  nodes.forEach((node: Node) => {
    if (node.locationType === 'Start' || node.locationType === 'Finish') {
      return;
    }
    if (line.intersectCircle(node.position, C.NODE_RADIUS * 2)) {
      node.locationType = 'Canyon';
      snake.push(new PIXI.Point(node.position.x, node.position.y));
    }
  });
  snake.push(new PIXI.Point(line.x2, line.y2));
  return snake;
}

export function addLocationBasedData(nodes: Node[], width: number): Node[] {

  // Add events to nodes
  let maxDifficulty = EventDifficulty.MaxDifficulty;
  return nodes.map(node => {
    let desiredDifficulty = _.clamp(Math.floor(maxDifficulty*node.position.x/width + Math.random() - 0.5), 0, maxDifficulty - 1);
    if (node.neighbors.length > 4) desiredDifficulty++;

    let locationEvents = AllEvents.filter(event => event.location === node.locationType);
    let locationEventsByDifficulty = _.groupBy(locationEvents, 'difficulty');

    for (let i = 0; i < maxDifficulty; i++) {
      let lower = locationEventsByDifficulty[desiredDifficulty + i];
      let upper = locationEventsByDifficulty[desiredDifficulty - i];
      let candidates = _.union(lower, upper);
      const relevantEvent = Sample(candidates);
      if (relevantEvent) {
        node.event = relevantEvent;
        break;
      }
    }
    return node;
  });
}

