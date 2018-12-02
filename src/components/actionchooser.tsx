
import React from 'react';
import { State } from '../game/state';
import _ from 'lodash';

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
};

export class ActionChooser extends React.Component<EventChooserProps> {
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
          <strong>You arrive at the Mountain.</strong> Outside, an old, frail man solicits you for help. He looks to be on the brink of death.
        </div>

        <EventButton
          onClick={ () => {}}
        >
          <strong>Storyteller:</strong> Tell him a story.
        </EventButton>

        <EventButton
          onClick={ () => {}}
        >
          <strong>Fighter:</strong> Try... to punch him?
        </EventButton>

        <EventButton
          onClick={ () => {}}
        >
          <strong>Stupid:</strong> Eat him.
        </EventButton>
      </div>
    )
  }
}
