
import { State } from './state';
import { Node } from './graph';

export class BlightManager {
  public applyBlightAndRenderImminent(state: State, node: Node, idol_time: number): void {

  }
  public unRenderImminent(): void {

  }
  public renderImminent(state: State, idol_position: Node, idol_time: number): void {
    // l2 distance? or graph distance?
    let neighborsByDegree: Node[][] = [ ];
    neighborsByDegree.push([idol_position]);
    neighborsByDegree.push(idol_position.neighbors);
    let deg2: Node[] = [];
    for (let neighbor of idol_position.neighbors) {
        deg2 = deg2.concat(neighbor.neighbors);
    }
    neighborsByDegree.push(deg2);

    for (let degree = 0; degree < 3; degree++ ){
      let neighbors: Node[] = neighborsByDegree[degree];
      neighbors;
    }
  }
}