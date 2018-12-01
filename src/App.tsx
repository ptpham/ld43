import * as React from 'react';
import { Game, State } from './game/main';

type CardChooserProps = {
  state: State;
};

//type CardChooserState = { };

export class CardChooser extends React.Component<CardChooserProps, State> {
  public static Instance: CardChooser;

  constructor(props: CardChooserProps) {
    super(props);
    CardChooser.Instance = this;
    this.state = props.state;
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

        <CardChooser state={this.state} />
      </div>
    );
  }
}

export default App;
