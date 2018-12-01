
import React from 'react';
import { State } from '../game/state';
import { LocationTypeData } from '../game/data';
import * as Graph from '../game/graph';
import _ from 'lodash';

type EventChooserProps = {
  gameState: State,
  node: Graph.Node,
  onDone: () => void
};

export class EventChooser extends React.Component<EventChooserProps> {
  
  sacrifice(targetSkill: string) {
    const { gameState, node } = this.props;
    const { cardsInCaravan } = gameState;
    const personWithSkill = _.find([...cardsInCaravan.keys()], x => x.skill === targetSkill);

    gameState.cardsInCaravan.delete(personWithSkill!);
    node.upgraded = true;
    this.props.onDone();
  }

  renderEmptyEvent() {
    let { onDone } = this.props;
    return <div>
      No one in your party can do anything here.
      <button onClick={onDone}>OK</button>
    </div>;
  }
  
  renderSacrificeEvent(targetSkill: string) {
    let { onDone } = this.props;
    return <div>
      Do you want to sacrifice a {targetSkill}?
      <button onClick={() => this.sacrifice(targetSkill)}>Yes</button>
      <button onClick={() => onDone()}>No</button>
    </div>;
  }

  renderOption() {
    let { node: { locationType }, gameState } = this.props;

    let data = LocationTypeData[locationType];

    if (!data) {
      return <div>Nothing!!!!!</div>
    }

    let targetSkill = data.targetSkill;
    let hasSkill = _.find([...gameState.cardsInCaravan.keys()], card => card.type === targetSkill) != null;

    return <div className="column">
      Woah you are on a {locationType}.
      {
        targetSkill && hasSkill 
          ? this.renderSacrificeEvent(targetSkill) 
          : this.renderEmptyEvent()
      }
    </div>;
  }

  render() {
    return <div className="event-chooser row">
      <img placeholder="Image for location goes here" />
      { this.renderOption() }
    </div>;
  }
}
