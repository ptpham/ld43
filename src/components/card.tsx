import { CardType } from "../game/data";
import React from "react";

type CardProps = {
  card: CardType;
}

export class Card extends React.Component<CardProps, {}> {
  constructor(props: CardProps) {
    super(props);
  }

  public update(state: CardProps) {
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