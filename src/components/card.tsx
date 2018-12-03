
import { CardType } from "../game/data";
import { State } from "../game/state";
import React from "react";

type CardProps = {
  card: CardType;
  gameState: State;
  onChangeSelection: (card: CardType, selected: boolean) => void;
}

type CardState = {
 selected: boolean;
}

const imageMap = new Map([
  ['Priest', '/assets/priest.png'],
  ['Woodsman', '/assets/woodcutter.png'],
  ['Architect', '/assets/builder.png'],
  ['Assassin', '/assets/assassin.png'],
  ['Cartographer', '/assets/cartographer.png'],
  ['Sage', '/assets/sage.png'],
  ['Merchant', '/assets/merchant.png'],
  ['Bard', '/assets/bard.png'],
  ['Fool', '/assets/fool.png']
]);

export class Card extends React.Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  public render(): JSX.Element {
    return (
      <div
        style={{
          display: "inline-block",
          margin: "0 20px 10px 20px",
        }}
      >
        <a 
          style={{
            textDecoration: "none",
            color: "black",
          }}
          onClick={() => { 
              this.setState({ selected: !this.state.selected })

              this.props.onChangeSelection(this.props.card, !this.state.selected);
            }
          }
          href="javascript:;"
        >

          <div
            style={{
              height: "200px",
              width: "100px",
              backgroundImage: `url(${imageMap.get(this.props.card.skill)}`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100%',
              ...{ opacity: this.state.selected ? 1 : undefined },
            }}
            className="cardhover"
          />

          <div>
            {
              this.state.selected
                ? <strong>{ this.props.card.skill }</strong>
                : this.props.card.skill
            }
          </div>

          <div style={{ 
            paddingTop: "0px" ,
            color: "blue",
            }}>
              { this.state.selected ? "Unselect" : "Select" }
          </div>
        </a>
      </div>
    );
  }
}
