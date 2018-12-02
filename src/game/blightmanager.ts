
import { State } from './state';
import { Node } from './graph';
import { SeedRandomGenerator } from './constants';

export class BlightManager {
  public applyBlightAndRenderImminent(state: State, node: Node, idol_time: number): void {

  }
  public unRenderImminent(): void {

  }
  public renderImminent(state: State, idol_position: Node, idol_time: number): void {
    let imminentBlight: Node[] = [];
    // l2 distance? or graph distance?
    let neighborsByDegree: Node[][] = [ ];
    neighborsByDegree.push([idol_position]);
    neighborsByDegree.push(idol_position.neighbors);
    let deg2: Node[] = [];
    for (let neighbor of idol_position.neighbors) {
        deg2 = deg2.concat(neighbor.neighbors);
    }
    neighborsByDegree.push(deg2);

    let random = SeedRandomGenerator(node.x + 12345 * node.y);

    for (let degree = 0; degree < 2 /* lol */; degree++ ){
      let neighbors: Node[] = neighborsByDegree[degree];
      for (let node of neighbors) {
        if (state.blightedNodes.has(node)) {
          continue;
        }
        if (random() < 0.4) {
          imminentBlight.push(node);
        }
      }
    }

    // rerender
    for (let node of imminentBlight) {
    }
  }
}