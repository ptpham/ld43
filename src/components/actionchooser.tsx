
import React from 'react';
import { State } from '../game/state';
import _ from 'lodash';
import { EventType, EventOption } from '../game/events';

const EventButton = (props: { 
  onClick ?: () => void;
  disabled?: boolean;
  children : React.ReactNode;
}): JSX.Element => {
  if (props.disabled) {
    return (
      <div 
        className={ "event-button" }
        style={{
          textDecoration: "none",
          display: "block",
          border: "1px solid lightgray",
          padding: "10px 5px",
          margin: "0 0 20px 0",
          color: props.disabled ? "gray" : "inherit",
        }}
      >
        { props.children }
      </div>
    );
  }

  return (
    <a 
      href="javascript:;"
      className={ "event-button" }
      onClick={() => props.onClick && props.onClick() }
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

type EventChooserState = {
  mode: { type: "choice" } | { type: "follow-up"; option: EventOption };
}

export class ActionChooser extends React.Component<EventChooserProps, EventChooserState> {
  constructor(props: EventChooserProps) {
    super(props);

    this.state = {
      mode: { type: "choice" },
    };
  }

  renderRequirement(opt: EventOption): {
    node              : React.ReactNode;
    renderNothingElse?: boolean;
  } {
    if (opt.skillRequired.type === "specific-skill") {
      const skill         = opt.skillRequired.skill;
      const doWeHaveSkill = [...this.props.gameState.cardsInCaravan.keys()].filter(x => x.skill === skill).length > 0;

      if (doWeHaveSkill) {
        return (
          { node: <strong>{ opt.skillRequired.skill } :</strong> }
        );
      } else {
        if (opt.skillRequired.withoutSkill === "Invisible") {
          return { node: null };
        } else if (opt.skillRequired.withoutSkill === "Unlabeled") {
          return { 
            node: <strong>?????????????</strong>,
            renderNothingElse: true 
          };
        } else if (opt.skillRequired.withoutSkill === "Everything") {
          return (
            { node: <strong>{ opt.skillRequired.skill } :</strong> }
          );
        } else {
          const x: never = opt.skillRequired.withoutSkill;

          throw new Error("x should be never" + x);
        }
      }
    } else if (opt.skillRequired.type === "no-skill") {
      return { node: null };
    } else {
      const x: never = opt.skillRequired;

      throw new Error("should be never! " + x);
    }
  }

  renderCost(opt: EventOption): React.ReactNode {
    if (opt.outcome) {
      if (opt.outcome.type === "gain-meat") {
        return (
          <span style={{ color: "#00cc00" }}>
            +{ opt.outcome.amount } meat
          </span>
        );
      } else if (opt.outcome.type === "lose-meat") {
        return (
          <span style={{ color: "red" }}>
            -{ opt.outcome.amount } meat
          </span>
        );
      } else {
        const x: never = opt.outcome;

        throw new Error("should be never! " + x);
      }
    }

    return null;
  }

  handleOption(option: EventOption): void {
    if (option.followUpText && this.state.mode.type === "choice") {
      this.setState({
        mode: {
          type: "follow-up",
          option,
        },
      });

      return;
    }

    this.props.gameState.handleChooseEventOption(option);
  }

  renderButton(option: EventOption): React.ReactNode {
    const { node: requirement, renderNothingElse } = this.renderRequirement(option);

    if (renderNothingElse) {
      return (
        <EventButton disabled>
          { requirement }
        </EventButton>
      );
    }

    return (
      <EventButton
        onClick={ () => this.handleOption(option) }
      >
        <strong>
          { requirement }
        </strong>{' '}
        { option.description }{' '}
        { this.renderCost(option) }
      </EventButton>
    );
  }

  renderDialogContent(): React.ReactNode {
    if (this.state.mode.type === "choice") {
      return (
        <>
          <div style={{ padding: "0 0 20px 0" }}>
            { this.props.event.description }
          </div>

          {
            this.props.event.options.map(option => 
              this.renderButton(option)
            )
          }
        </>
      );
    } else if (this.state.mode.type === "follow-up") {
      return (
        <div style={{ padding: "0 0 20px 0" }}>
          { this.state.mode.option.followUpText }
        </div>
      );
    } else {
      const x: never = this.state.mode;
      return x;
    }
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
        { this.renderDialogContent() }
      </div>
    )
  }
}
