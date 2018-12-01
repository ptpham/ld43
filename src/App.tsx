import * as React from 'react';
import { Game, State } from './game/main';
import { CardChooser } from './components/cardchooser';
import { C } from './game/constants';

class App extends React.Component {
  state !: State;
  app   !: PIXI.Application;
  public div!: HTMLDivElement;

  constructor(props: any) {
    super(props);
    //PIXI.loader.load(() => )
    this.start();
  }

  start() {
    this.app = new PIXI.Application(
      C.CANVAS_WIDTH,
      C.CANVAS_HEIGHT
    );
    this.state = new State(this.app.stage);
  }

  public componentDidMount() {
    new Game(this.div);
  }

  public render() {
    return (
      <div>
        <div
          className="App"
          ref={ div => this.div = div! }
        >

        </div>

        <CardChooser gameState={this.state} />
      </div>
    );
  }
}

export default App;
