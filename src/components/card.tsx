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
        style={{
          display: "inline-block",
          border: "1px solid lightgray",
          height: "200px",
          width: "100px",
          margin: "0 20px 10px 20px",
        }}
      >
        <div>{ this.props.card.type }</div>
      </div>
    );
  }
}