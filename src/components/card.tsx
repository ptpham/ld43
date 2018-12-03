
import { CardType, CardToAsset } from "../game/data";
import { State } from "../game/state";
import React from "react";

type CardProps = {
  card: CardType;
  gameState: State;
  onChangeSelection: (card: CardType, selected: boolean) => void;
  style?: object;
  hideContents?: boolean;
}

type CardState = {
 selected: boolean;
}

const imageMap = CardToAsset;
export class Card extends React.Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  public render(): JSX.Element {
    const { style = {}, hideContents = false } = this.props;
    return (
      <div
        onClick = { () => {
          //console.log("cawas clicked", this.props.card, this.props.gameState);
          //this.props.gameState.active_caravan.push(this.props.card);
        } }
        style={Object.assign({
          display: "inline-block",
          border: "1px solid lightgray",
          height: "200px",
          width: "100px",
          margin: "0 20px 10px 20px",
          backgroundImage: `url(${imageMap.get(this.props.card.skill)}`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%'
        }, style)}
      >
        {!hideContents &&
          <>
            <div>
              {
                this.state.selected
                  ? <strong>{ this.props.card.skill }</strong>
                  : this.props.card.skill
              }
            </div>
            <div>Meat: { this.props.card.meat }</div>

            <div style={{ paddingTop: "20px" }}>
              <a 
                onClick={() => { 
                    this.setState({ selected: !this.state.selected })

                    this.props.onChangeSelection(this.props.card, !this.state.selected);
                  }
                }
                href="javascript:;">
                { this.state.selected ? "Unselect" : "Select" }
              </a>
            </div>
          </>
        }
      </div>
    );
  }
}
