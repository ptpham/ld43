
import { State } from '../game/state';
import { CardType } from '../game/data';
import * as React from 'react';
import { Card } from './card';

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
          skill: "WoodCutter",
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
          skill: "Builder",
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
        >Choose your Caravan! {"40"} characters available! </div>

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
          <a href="javascript:;" onClick={() => this.props.onDone(this.state.selectedCards)}>
            Go!
          </a>
        </div>
      </div>
    );
  }
}

