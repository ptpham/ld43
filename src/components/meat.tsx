import React from "react";

type ToolbarProps = {

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
        <div>
            BOWEI WAS HERE
        </div>
      </div>
    );
  }
}
