import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Game } from './game/main';
import { C } from './game/constants';

//const game = new Game();

C.SPRITE_ASSETS.forEach(asset => {
  PIXI.loader.add(asset, `assets/${ asset }.png`);
});
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.loader.load(() => {
  const game = new Game();
  ReactDOM.render(
    <App 
      game={ game }
    />, 
    document.getElementById('root')
  );
});

document.body.style.width = `${C.CANVAS_WIDTH}px`;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
