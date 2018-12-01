import * as React from 'react';
import { Game, State } from './game/main';
import { CardType } from './game/data';
import { Card } from './components/card';
import { C } from './game/constants';

type CardChooserProps = {
  gameState: State;
};

type CardChooserState = {
  cards: CardType[];
  selectedCards: Set<CardType>;
};

export class CardChooser extends React.Component<CardChooserProps, CardChooserState> {
  public static Instance: CardChooser;

  constructor(props: CardChooserProps) {
    super(props);

    CardChooser.Instance = this;
    this.state = {
      selectedCards: new Set(),
      cards: [
        {
          type: "Builder",
          meat: 3,
          skill: 7,
        },
        {
          type: "Storyteller",
          meat: 7,
          skill: 2,
        },
        {
          type: "Fighter",
          meat: 1,
          skill: 1,
        },
        {
          type: "Stupid",
          meat: 1,
          skill: 9,
        },
      ]
    };
  }

  public update(state: CardChooserState) {
    this.setState(state);
  }

  private changeSelection(card: CardType, selected: boolean): void {
    if (this.state.selectedCards.has(card) && !selected) {
      const newSet = new Set(this.state.selectedCards);
      newSet.delete(card);

      this.setState({ selectedCards: newSet, });

      return;
    }

    if (!this.state.selectedCards.has(card) && selected) {
      const newSet = new Set(this.state.selectedCards);
      newSet.add(card);

      this.setState({ selectedCards: newSet, });

      return;
    }
  }

  public render(): JSX.Element {
    return (
      <div
        onClick={ () => console.log('was clicked!') }
        style={{
          width: "600px",
          padding: "20px",
          border: "1px solid lightgray",
        } }
      >
        <div
          style={{
            fontSize: "20px",
          }}
        >Choose your Caravan!</div>

        <div>
          {
            this.state.cards.map(card => 
              <Card 
                card={ card } 
                gameState={ this.props.gameState } 
                onChangeSelection={ (card, selected) => {
                  this.changeSelection(card, selected);
                }}
              />
            )
          }
        </div>
        <div style={{ textAlign: "center" }}>
          <a href="javascript:;">
            Go!
          </a>
        </div>
      </div>
    );
  }
}

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
