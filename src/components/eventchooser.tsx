
import React from 'react';
import { State } from '../game/state';
import { LocationType, LocationTypeData } from '../game/data';
import * as Graph from '../game/graph';
import _ from 'lodash';

type EventChooserProps = {
  gameState: State,
  node: Graph.Node,
  onDone: () => void
};

export class EventChooser extends React.Component<EventChooserProps> {
  
  sacrifice(targetSkill: string) {
    let { gameState } = this.props;
    let { active_caravan } = gameState;
    let personWithSkill = _.find(active_caravan, x => x.type == targetSkill);
    gameState.active_caravan = gameState.active_caravan.filter(x => x != personWithSkill);
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
    let hasSkill = _.find(gameState.active_caravan, card => card.type === targetSkill) != null;

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

