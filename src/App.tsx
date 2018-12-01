
import * as React from 'react';
import { State } from './game/state';
import { Game } from './game/main';
import { CardChooser } from './components/cardchooser';
import { C } from './game/constants';

class App extends React.Component {
  state: { game?: Game };
  app   !: PIXI.Application;
  public div!: HTMLDivElement;

  constructor(props: any) {
    super(props);
    //PIXI.loader.load(() => )
    this.state = {};
  }

  proxifyGame(game: Game) {
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
    this.proxifyGame(game!);
  }

  public componentDidMount() {
    this.setState({ game: new Game(this.div) }, () => {
      this.start();
    });
  }

  renderGameStateComponents() {
    let { game } = this.state;
    if (game == null || game.state == null) return null;

    return <div>
      <div>You are on a {game.state.caravan_location.locationType}</div>
      <CardChooser gameState={game.state} />
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
