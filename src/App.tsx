import * as React from 'react';
import { Game } from './game/main';

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
  public div!: HTMLDivElement;

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

        <CardChooser />
      </div>
    );
  }
}

export default App;
