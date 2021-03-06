import * as React from 'react';
import { State } from './game/state';
import { Game } from './game/main';
import { CardChooser } from './components/cardchooser';
import './App.css';
import { Toolbar } from './components/meat';
import { Interface } from './components/interface';
import { CardType } from './game/data';
import { ActionChooser } from './components/actionchooser';
import { printLocationTypeSummary } from './check';

if (true) {
  printLocationTypeSummary();
}

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
    for (let card of cards) {
      this.state.gameState.cardsInWholeGame.delete(card);
    }
    this.state.gameState.isLocationDone = true;
    this.state.gameState.choosingCharacters = false;
    this.setState({ isEventVisible: false });
  }

  renderCurrentLocation(state: State) {
    const { caravanLocation } = state;

    switch (caravanLocation.locationType) {
      case 'Start':
        for (let card of this.state.gameState.cardsInCaravan) {
          this.state.gameState.cardsInWholeGame.add(card);
        }

        this.state.gameState.cardsInCaravan = new Set();

        return (
          <CardChooser
            gameState={state}
            onDone={cards => this.onSelectCards(cards)}
          />
        );
      default:
        return null;
    }
  }

  renderCardChooser() {
    let { gameState, isEventVisible } = this.state;

    if (gameState.isLocationDone) return null;
    if (
      gameState.caravanLocation.locationType === "Start" &&
      gameState.choosingCharacters
    ) {
      return <div className={`modal ${isEventVisible ? 'show-map' : ''}`}>
        <div className="content"> { this.renderCurrentLocation(gameState) } </div>
      </div>;
    }

    return null;
  }

  onDoEvent() {
    this.state.gameState.isLocationDone = true;
    this.setState({ isEventVisible: false });
  };

  public render() {
    const gameMode = this.state.gameState.getGameMode();

    return (
      <div style={{position: "relative"}}>
        <Toolbar gameState={this.state.gameState}/>
        <div 
          style={{
            display: "inline-block",
          }}
          ref={ div => this.div = div! }>
        </div>

        <Interface
          gameState={this.state.gameState}
          onDropIdol={() => this.state.gameState.onDropIdol()}
          onPickUpIdol={() => this.state.gameState.onPickUpIdol()}
          onClickChangeParty={() => this.state.gameState.onRequestChangeParty()}
        />

        {
          gameMode === "Looking At Event" &&
            <ActionChooser 
              event={ this.state.gameState.activeEvent! }
              gameState={ this.state.gameState }
            />
        }
        {
          gameMode === "Choosing Characters" &&
          this.renderCardChooser()
        }
      </div>
    );
  }
}

export default App;
