
import React from 'react';
import { State } from '../game/state';
import { LocationType, LocationTypeData } from '../game/data';
import _ from 'lodash';

type EventChooserProps = {
  gameState: State,
  locationType: LocationType,
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
    let { locationType, gameState } = this.props;

    let data = LocationTypeData[locationType];
    let targetSkill = _.get(data, 'targetSkill');
    let hasSkill = _.find(gameState.active_caravan, card => card.skill == targetSkill) != null;

    return <div className="column">
      Woah you are on a {locationType}.
      {
        (hasSkill) ? this.renderSacrificeEvent(targetSkill) : this.renderEmptyEvent()
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

