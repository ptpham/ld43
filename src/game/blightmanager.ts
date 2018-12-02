
import { State, IdolState } from './state';
import { Node } from './graph';
import { SeedRandomGenerator } from './constants';
import { Particles } from './particles';
import { IEntity } from './entity';
import { EventType } from './events';
//import * from 'crypto';

export class BlightManager implements IEntity {
  // reserve undefined so we can garbage collect unused particles properly without race conditions
  public imminentParticles: (Particles | undefined)[] = [];
  public imminent: Node[] = [];
  public blightParticles: (Particles | undefined)[] = [];
  
  public applyBlightAndRenderImminent(state: State, idol_position: Node, idol_time: number): void {
    for (let node of this.imminent) {
      state.blightedNodes.add(node);
      if (node.event) {
        let event: EventType = node.event;
        if (event.whenBlighted) {
          node.event = event.whenBlighted;
        }
      }
      this.blightParticles.push(new Particles(state.gameMap.graphSprite.graphSprite, node.position.x, node.position.y, 60));
    }
    this.unRenderImminent();
    this.renderImminent(state, idol_position, idol_time);
  }

  public unRenderImminent(): void {
    for (let i = 0; i < this.imminentParticles.length; i++) {
      let particle = this.imminentParticles[i];
      if (particle) {
        particle.disable(() => {
          this.imminentParticles[i] = undefined;
        })
      }
    }
    this.imminent = [];
  }

  private computeSeed(state: State, idol_position: Node): number {
    // computes a deterministic seed based on the already blighted nodes and the current node
    let seed = 0;
    for (let node of state.blightedNodes) {
      seed += node.position.x + 12345 * node.position.y;
    }
    seed += idol_position.position.x + 12345 * idol_position.position.y;
    //seed += hash(state.getIdolBlightDanger().text);
    return seed;
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

    let random = SeedRandomGenerator(this.computeSeed(state, idol_position));

    for (let degree = 0; degree < 2 /* lol */; degree++ ){
      let neighbors: Node[] = neighborsByDegree[degree];
      for (let node of neighbors) {
        if (state.blightedNodes.has(node)) {
          continue;
        }
        if (random() < 0.4) {
          this.imminent.push(node);
        }
      }
    }

    // rerender
    for (let node of this.imminent) {
      this.imminentParticles.push(new Particles(state.gameMap.graphSprite.graphSprite, node.position.x, node.position.y, 6));
    }
  }

  public getIdolBlightDanger(time_for_idol: number, idolState: IdolState): { text: string, remaining: number} {
    let t = time_for_idol;
    let to_ret: { text: string, remaining: number } = { text: "", remaining: 0};
    if (t < 2) {
      to_ret = { text: "Minimal", remaining: 2 - t };
    } else if (t < 4) {
      to_ret = { text: "Low", remaining: 4 - t };
    } else if (t < 6) {
      to_ret = { text: "Medium", remaining: 6 - t };
    } else if (t < 40) {
      to_ret = { text: "High", remaining: 40 - t };
    } else {
      to_ret = { text: "Catastrophic", remaining: t % 2 + 1 };
    }
    if (idolState.state === 'carried') {
      to_ret.remaining = -1; // never
    }
    if (idolState.state === 'gone') {
      to_ret = { text: "much win", remaining: -1 };
    }
    return to_ret;
  }

  public update(state: State): void {
    for (let particle of this.imminentParticles) {
      if (particle) {
        particle.update_(state);
      }
    }
    for (let particle of this.blightParticles) {
      if (particle) {
        particle.update_(state);
      }
    }
  }
}