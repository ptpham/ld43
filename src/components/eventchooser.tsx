
import React from 'react';
import { State } from '../game/state';
import { LocationType } from '../game/data';

type EventChooserProps = {
  gameState: State,
  locationType: LocationType,
  targetSkill: string,
  onDone: () => void
};

export class EventChooser extends React.Component<EventChooserProps> {
  
  sacrifice() {
    this.props.onDone();
  }

  renderOption() {
    let { locationType, targetSkill, onDone } = this.props;
    return <div className="row">
      Woah you are on a {locationType}.
      Do you want to sacrifice a {targetSkill}?
      <button onClick={() => this.sacrifice()}>Yes</button>
      <button onClick={() => onDone()}>No</button>
    </div>;
  }

  render() {
    return <div className="event-chooser">
      <img placeholder="Image for location goes here" />
      { this.renderOption() }
    </div>;
  }
}

