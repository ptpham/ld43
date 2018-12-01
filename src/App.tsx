import * as React from 'react';
import { State } from './game/state';
import { Game } from './game/main';
import { CardChooser } from './components/cardchooser';
import { EventChooser } from './components/eventchooser';
import './App.css';
import { Toolbar } from './components/meat';
import { Sidebar } from './components/sidebar';

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

    // stupid stuff to ensure we always propagate changes to react.

    props.game.state.addChangeListener((gameState) => {
      this.setState({ gameState })
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

    let { caravan_location } = state;
    switch (caravan_location.locationType) {
      case 'Start':
        return (
          <CardChooser 
            gameState={state} 
            onDone={ cards => onSelectCards(cards) }
          />
        );
      default:
        return <EventChooser gameState={state} onDone={onDone}
          node={caravan_location}/>;
    }
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
        <Toolbar gameState={this.state.gameState}/>
        <div 
          style={{
            display: "inline-block",
          }}
          ref={ div => this.div = div! }>
          { this.renderGameStateComponents() }
        </div>

        <Sidebar 
          onDropIdol={() => this.state.gameState.onDropIdol()}
          onPickUpIdol={() => this.state.gameState.onPickUpIdol()}
          gameState={this.state.gameState}
        />
      </div>
    );
  }
}

export default App;
