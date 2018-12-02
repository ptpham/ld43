import React from "react";
import { State } from "../game/state";

type ToolbarProps = {
    gameState: State;
}

type ToolbarState = {
}

export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);

    this.state = {
      //selected: false,
    };
  }

  public render(): JSX.Element {
    return (
      <div
        onClick = { () => {
          //console.log("cawas clicked", this.props.card, this.props.gameState);
          //this.props.gameState.active_caravan.push(this.props.card);
        } }
        style={{
          //display: "inline-block",
          //border: "1px solid lightgray",
          //height: "200px",
          //width: "100px",
          //margin: "0 20px 10px 20px",
        }}
      >
        <div
          style = {{
            display: "inline-block",
            textAlign: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
            THIS IS A TOOLBAR
        </div>
        <div
          style = {{
            display: "inline-block",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          Meat: { this.props.gameState && this.props.gameState && this.props.gameState.meat }
        </div>
        <div
          style = {{
            display: "inline-block",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          Weeks elapsed: { this.props.gameState.time.from_start }
        </div>
        <div
          style = {{
            display: "inline-block",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          Crew count: { this.props.gameState.cardsInCaravan.size }
        </div>
        <div
          style = {{
            display: "inline-block",
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          Idol danger: { this.props.gameState.getIdolBlightDanger() }
        </div>
      </div>
    );
  }
}
