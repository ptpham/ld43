
import { State } from '../game/state';
import { CardType } from '../game/data';
import * as React from 'react';
import { Card } from './card';
import { C } from "../game/constants";

type CardChooserProps = {
  gameState: State;
  onDone: (selectedCards: Set<CardType>) => void;
};

type CardChooserState = {
  cards: CardType[];
  selectedCards: Set<CardType>;
};

export class CardChooser extends React.Component<CardChooserProps, CardChooserState> {
  public static Instance: CardChooser;

  constructor(props: CardChooserProps) {
    super(props);

    CardChooser.Instance = this;
    this.state = {
      selectedCards: new Set(),
      cards: [
        {
          skill: "Woodsman",
          meat: 3,
        },
        {
          skill: "Priest",
          meat: 7,
        },
        {
          skill: "Assassin",
          meat: 1,
        },
        {
          skill: "Architect",
          meat: 1,
        },
      ]
    };
  }

  public update(state: CardChooserState) {
    this.setState(state);
  }

  private changeSelection(card: CardType, selected: boolean): void {
    if (this.state.selectedCards.has(card) && !selected) {
      const newSet = new Set(this.state.selectedCards);
      newSet.delete(card);

      this.setState({ selectedCards: newSet, });

      return;
    }

    if (!this.state.selectedCards.has(card) && selected) {
      const newSet = new Set(this.state.selectedCards);
      newSet.add(card);

      this.setState({ selectedCards: newSet, });

      return;
    }
  }

  public render(): JSX.Element {
    return (
      <div
        //onClick={ () => console.log('was clicked!') }
        style={{
          width: "600px",
          padding: "20px",
          border: "1px solid lightgray",
        } }
      >
        <div
          style={{
            fontSize: "20px",
            paddingBottom: "10px"
          }}
        >Choose your Caravan! {this.props.gameState.cardsInWholeGame.size} characters available! </div>

        <div>
          {
            this.state.cards.map(card => 
              <Card 
                card={ card } 
                gameState={ this.props.gameState } 
                onChangeSelection={ (card, selected) => {
                  this.changeSelection(card, selected);
                }}
              />
            )
          }
        </div>
        <div 
          onClick = { () => console.log('lets embark!') }
          style={{ textAlign: "center" }}>
          { 
            (() => { 
              if ( 0 < this.state.selectedCards.size && this.state.selectedCards.size <= C.MAX_PARTY_SIZE) { 
                return (
                  <a href="javascript:;" onClick={() => this.props.onDone(this.state.selectedCards)}> 
                  { this.state.selectedCards.size + "/" + C.MAX_PARTY_SIZE } Go{ this.state.selectedCards.size === C.MAX_PARTY_SIZE ? "" : "??"}! 
                  </a> 
                );
              } else { 
                return (
                  <div>
                  { this.state.selectedCards.size + "/" + C.MAX_PARTY_SIZE } Go! 
                  </div>
                );
              }
            })() 
          }
        </div>
      </div>
    );
  }
}

