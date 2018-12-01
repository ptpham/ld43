import * as React from 'react';
import { State } from './game/state';
import { Game } from './game/main';
import { CardChooser } from './components/cardchooser';
import { EventChooser } from './components/eventchooser';
import './App.css';
import { Toolbar } from './components/meat';
import { Sidebar } from './components/sidebar';
import { CardType } from './game/data';

type AppState = {
  isEventVisible: boolean;
  gameState     : State;
}

type AppProps = {
  game: Game;
}

class App extends React.Component<{ game: Game }, AppState>  {
  public div!: HTMLDivElement;

  constructor(props: AppProps) {
    super(props);
    this.state = { 
      isEventVisible: false,
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

  onSelectCards(cards: Set<CardType>): void {
    this.state.gameState.cardsInCaravan   = cards;
    this.state.gameState.isLocationDone = true;
    this.setState({ isEventVisible: false });
  }

  renderCurrentLocation(state: State) {
    let onDone = () => {
      state.isLocationDone = true;
      this.setState({ isEventVisible: false });
    };

    let { caravan_location } = state;
    switch (caravan_location.locationType) {
      case 'Start':
        return (
          <CardChooser 
            gameState={state} 
            onDone={ cards => this.onSelectCards(cards) }
          />
        );
      default:
        return <EventChooser gameState={state} onDone={onDone}
          node={caravan_location}/>;
    }
  }

  renderGameStateComponents() {
    let { gameState, isEventVisible } = this.state;
    if (!gameState || gameState.isLocationDone) return null;

    return <div className={`modal ${isEventVisible ? 'show-map' : ''}`}>
      { !isEventVisible ? <button onClick={() => this.setState({ isEventVisible: true })}>Hide Event</button> : null }
      { isEventVisible ? <button className="glowing" onClick={() => this.setState({ isEventVisible: false })}>Show Event</button> : null }
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
