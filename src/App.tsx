import * as React from 'react';
import { State } from './game/state';
import { Game } from './game/main';
import { CardChooser } from './components/cardchooser';
import './App.css';
import { Toolbar } from './components/meat';

type AppState = {
  showMap  : boolean;
  gameState: State;
}

type AppProps = {
  game: Game;
}

class App extends React.Component<{ game: Game }, AppState>  {
  public div!: HTMLDivElement;

  constructor(props: AppProps) {
    super(props);
    this.state = { 
      showMap: false,
      gameState: props.game.state
    };

    this.props.game.start({
      set: (gameState: State, prop: string, value: any, receiver: any) => {
        gameState[prop] = value;
        this.setState({ gameState });

        return true;
      }
    });
  }

  componentDidMount(): void {
    this.div!.appendChild(this.props.game.view!);
  }

  renderCurrentLocation(state: State) {
    let onDone = () => {
      state.isLocationDone = true;
      this.setState({ showMap: false });
    };


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
    let { gameState, showMap } = this.state;
    if (!gameState || gameState.isLocationDone) return null;

    return <div className={`modal ${showMap ? 'show-map' : ''}`}>
      { !showMap ? <button onClick={() => this.setState({ showMap: true })}>Hide Event</button> : null }
      { showMap ? <button className="glowing" onClick={() => this.setState({ showMap: false })}>Show Event</button> : null }
      <div className="content"> { this.renderCurrentLocation(gameState) } </div>
    </div>;
  }

  public render() {
    return (
      <div>
<<<<<<< HEAD
        <MeatToolbar />
        <div
          className="App"
          ref={ div => this.div = div! }
        >
        { this.renderGameStateComponents() }
=======
        <div>
          Meat: { this.state.gameState && this.state.gameState && this.state.gameState.meat }
        </div>
        <div ref={ div => this.div = div! }>
          { this.renderGameStateComponents() }
>>>>>>> ce34e56f88b29ef498b949adc7c07cb751b08d67
        </div>
      </div>
    );
  }
}

export default App;
