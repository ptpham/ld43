
import * as React from 'react';
import { State } from './game/state';
import { Game } from './game/main';
import { CardChooser } from './components/cardchooser';
import { C } from './game/constants';
import './App.css';

class App extends React.Component {
  state: { game?: Game };
  app   !: PIXI.Application;
  public div!: HTMLDivElement;

  constructor(props: any) {
    super(props);
    //PIXI.loader.load(() => )
    this.state = {};
  }

  startGame(game: Game) {
    let self = this;
    game.loaded.then(() => {
      this.setState({ game });
      game.start({
        set(gameState: State, prop: string, value: any, receiver: any) {
          gameState[prop] = value;
          self.setState({ game });
          return true;
        }
      });
    });
  }

  start() {
    this.app = new PIXI.Application(
      C.CANVAS_WIDTH,
      C.CANVAS_HEIGHT
    );
    let { game } = this.state;
    this.startGame(game!);
  }

  public componentDidMount() {
    this.setState({ game: new Game(this.div) }, () => {
      this.start();
    });
  }

  renderCurrentLocation(state: State) {
    let onDone = () => state.isLocationDone = true;

    switch (state.caravan_location.locationType) {
      case 'Start':
        return <CardChooser gameState={state} onDone={onDone}/>;
    }

    return <div className="column" onClick={onDone}>
      Woah you're on a {state.caravan_location.locationType} now.
      <button onClick={onDone}>OK</button>
    </div>;
  }

  renderGameStateComponents() {
    let { game } = this.state;
    if (game == null || game.state == null || game.state.isLocationDone) return null;

    return <div className="modal">
      { this.renderCurrentLocation(game.state) }
    </div>;
  }

  public render() {
    return (
      <div>
        <div
          className="App"
          ref={ div => this.div = div! }
        >
        { this.renderGameStateComponents() }
        </div>
      </div>
    );
  }
}

export default App;
