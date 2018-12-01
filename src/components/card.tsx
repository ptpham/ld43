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
      <div >
        I'm a card! { this.props.card.type }
      </div>
    );
  }
}