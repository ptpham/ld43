import * as React from 'react';
import { Game, State } from './game/main';
import { CardType } from './game/data';
import { Card } from './components/card';

type CardChooserProps = {
  gameState: State;
};

type CardChooserState = {
  cards: CardType[];
};

export class CardChooser extends React.Component<CardChooserProps, CardChooserState> {
  public static Instance: CardChooser;

  constructor(props: CardChooserProps) {
    super(props);

    CardChooser.Instance = this;
    this.state = {
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

  public render(): JSX.Element {
    return (
      <div
        onClick={ () => console.log('was clicked!') }
        style={{
          width: "600px",
          height: "200px",
          padding: "20px",
          border: "1px solid lightgray",
        } }
      >
        <div>Card Chooser 9000 </div>

        {
          this.state.cards.map(card => 
            <Card card={ card } />
          )
        }
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
