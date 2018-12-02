
import React from 'react';
import { State } from '../game/state';
import _ from 'lodash';
import { EventType, EventOption } from '../game/events';

const EventButton = (props: { 
  onClick : () => void;
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <a 
      href="javascript:;"
      className="event-button"
      onClick={() => props.onClick() }
      style={{
        textDecoration: "none",
        display: "block",
        border: "1px solid lightgray",
        padding: "10px 5px",
        margin: "0 0 20px 0",
      }}
    >
      <div>
        { props.children }
      </div>
    </a>
  );
}

type EventChooserProps = {
  gameState: State,
  event: EventType,
};

export class ActionChooser extends React.Component<EventChooserProps> {
  renderRequirement(eventOption: EventOption): void {
  }

  render() {
    return (
      <div
        style={{
          position: "fixed",
          top: "150px",
          left: "150px",
          width: "400px",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        <div style={{ padding: "0 0 20px 0" }}>
          { this.props.event.description }
        </div>

        {
          this.props.event.options.map(option => 
            <EventButton
              onClick={ () => {}}
            >
              <strong>
                { this.renderRequirement() }
              </strong>
              { option.description }
            </EventButton>
          )
        }
      </div>
    )
  }
}
