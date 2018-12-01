import * as PIXI from 'pixi.js';

export class Game {
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  stage: PIXI.Container;

  constructor(div: HTMLDivElement) {
    this.renderer = PIXI.autoDetectRenderer(
      window.innerWidth,
      window.innerHeight, {
        "antialias": true,
        "autoResize": true,
        "transparent": true,
        "resolution": 2
      }
    );

    div.appendChild(this.renderer.view);

    const sprite = new PIXI.Graphics();
    sprite.x = 0;
    sprite.y = 0;

    sprite.drawRect(0, 0, 25, 25);

    this.stage = new PIXI.Container();
    this.stage.addChild(sprite);

    this.animate();
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    this.renderer.render(this.stage);
  }
}