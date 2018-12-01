import { CardType } from "../game/data";
import React from "react";

type CardProps = {
  card: CardType;
}

export class Card extends React.Component<CardProps, {}> {
  public static Instance: CardChooser;

  constructor(props: CardChooserProps) {
    super(props);

    CardChooser.Instance = this;
    this.state = {
      text: "ok",
      cards: [
        {
          type: "Builder",
          meat: 3,
          skill: 7,
        },
        {
          type: "Storyteller",
          meat: 7,
          skill: 2,
        },
        {
          type: "Fighter",
          meat: 1,
          skill: 1,
        },
        {
          type: "Stupid",
          meat: 1,
          skill: 9,
        },
      ]
    };
  }

  public update(state: CardChooserState) {
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