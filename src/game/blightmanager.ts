
import { State } from './state';
import { Node } from './graph';
import { SeedRandomGenerator } from './constants';
import { Particles } from './particles';
import { IEntity } from './entity';

export class BlightManager implements IEntity {
  public particles: Particles[] = [];
  
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

    let random = SeedRandomGenerator(idol_position.position.x + 12345 * idol_position.position.y);

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
      this.particles.push(new Particle(this.state.stage, node.position.x, node.position.y, 6));
    }
  }

  public update(state: State): void {
    for ( let particle of this.particles ) {
      particle.update_(state);
    }
  }
}