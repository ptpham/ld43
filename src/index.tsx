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

PIXI.loader.load(() => {
  const game = new Game();
  ReactDOM.render(
    <App 
      game={ game }
    />, 
    document.getElementById('root')
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
