
import { Point } from 'pixi.js';
import { LocationType } from './data';

export type Node = {
    position: Point;
    locationType: LocationType;
    neighbors: Node[];
}

function constructStartNode(height: number, spacing: number):Node {
    return {
        position: new Point(spacing, height/2),
        locationType: LocationType.Start,
        neighbors: []
    }
}

export function generateGraph(width: number, height: number, spacing: number, maxIters: number = 1000): Node[] {
    let result: Node[] = [];

    for (let i = 0; i < maxIters; i++) {
        let x: number = Math.random();
        let y: number = Math.random();

        for (let node of result) {
            let distance = Math.sqrt((node.x - x)**2 + (node.y - y)**2);
            if (distance < spacing) result.push({
                position: new Point(x, y),

            });
        }
    }

    return result;    
}

