import * as React from 'react';
import { Game, State } from './game/main';

type CardChooserProps = {
  gameState: State;
};

type CardChooserState = {
  text: string;
};

export class CardChooser extends React.Component<CardChooserProps, CardChooserState> {
  public static Instance: CardChooser;

  constructor(props: CardChooserProps) {
    super(props);

    CardChooser.Instance = this;
    this.state = {
      text: "ok",
    };

  }

  public update(state: State) {
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
        Card Chooser 9000
        { this.state.text }
      </div>
    );
  }
}

class App extends React.Component {
  state !: State;
  public div!: HTMLDivElement;

  constructor(props: any) {
    super(props);
    //PIXI.loader.load(() => )
    this.start();
  }

  start() {
    this.state = new State();
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
