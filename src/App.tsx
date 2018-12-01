import * as React from 'react';
import './App.css';

import { Game } from './main';

class App extends React.Component {
  public div!: HTMLDivElement;

  public componentDidMount() {
    new Game(this.div);
  }

  public render() {
    return (
      <div className="App" ref={ div => this.div = div! } />
    );
  }
}

export default App;
