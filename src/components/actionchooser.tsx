
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
        if (opt.skillRequired.withoutRequirement === "Invisible") {
          return { node: null };
        } else if (opt.skillRequired.withoutRequirement === "Unlabeled") {
          return { 
            node: <strong>?????????????</strong>,
            renderNothingElse: true 
          };
        } else if (opt.skillRequired.withoutRequirement === "Everything") {
          return (
            { node: <strong>{ opt.skillRequired.skill } :</strong> }
          );
        } else {
          const x: never = opt.skillRequired.withoutRequirement;

          throw new Error("x should be never" + x);
        }
      }
    } else if (opt.skillRequired.type === "specific-item") {
      const item         = opt.skillRequired.skill;
      const doWeHaveItem = this.props.gameState.items.has(item);

      // literally just copy and paste the above code

      if (doWeHaveItem) {
        return (
          { node: <strong>Use { item } :</strong> }
        );
      } else {
        if (opt.skillRequired.withoutRequirement === "Invisible") {
          return { node: null };
        } else if (opt.skillRequired.withoutRequirement === "Unlabeled") {
          return { 
            node: <strong>?????????????</strong>,
            renderNothingElse: true 
          };
        } else if (opt.skillRequired.withoutRequirement === "Everything") {
          return (
            { node: <strong>{ item } :</strong> }
          );
        } else {
          const x: never = opt.skillRequired.withoutRequirement;

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
      const outcomes = Array.isArray(opt.outcome) ? opt.outcome : [opt.outcome];
      const meatOutcome = outcomes.filter(x => x.type === "gain-meat" || x.type === "lose-meat")[0];

      if (meatOutcome) {
        if (meatOutcome.type === "gain-meat") {
          if (meatOutcome.hidden) {
            return null;
          } else {
            return (
              <span style={{ color: "#00cc00" }}>
                +{ meatOutcome.amount } meat
              </span>
            );
          }
        } else if (meatOutcome.type === "lose-meat") {
          if (meatOutcome.hidden) {
            return null;
          } else {
            return (
              <span style={{ color: "red" }}>
                -{ meatOutcome.amount } meat
              </span>
            );
          }
        } else {
          throw new Error("should be impossible! " + meatOutcome);
        }
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
        <span
          style={{
            color: 
              option.skillRequired.type === "specific-skill" 
                ? "green" 
                : option.skillRequired.type === "specific-item" 
                  ? "blue" 
                  : undefined,
          }}
        >
          { option.description }{' '}
          { this.renderCost(option) }
        </span>
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
      const option = this.state.mode.option;
      const outcomes = option.outcome 
        ? Array.isArray(option.outcome)
          ? option.outcome
          : [option.outcome]
        : [];

      return (
        <div style={{ padding: "0 0 20px 0" }}>
          <div>
            { option.followUpText }
          </div>
          {
            outcomes.map(outcome => {
              if (outcome.type === "gain-meat") {
                return (
                  <div
                    style={{
                      backgroundColor: "lightgreen",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You gain { outcome.amount } meat!
                  </div>
                )
              }

              if (outcome.type === "lose-meat") {
                return (
                  <div
                    style={{
                      backgroundColor: "pink",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You lose { outcome.amount } meat!
                  </div>
                )
              }

              if (outcome.type === "gain-item") {
                return (
                  <div
                    style={{
                      backgroundColor: "lightblue",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You gain a { outcome.item }!
                  </div>
                )
              }

              if (outcome.type === "lose-member-strong") {
                return (
                  <div
                    style={{
                      backgroundColor: "lightblue",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You have permanently left behind your { outcome.skill }.
                  </div>
                )
              }
              const x: never = outcome;
              throw new Error("x should be never " + x);
            })
          }
          <div
            style={{ textAlign: "center", paddingTop: "20px" }}
          >
            <a 
              href="javascript:;"
              onClick={ () => this.handleOption(option) }
            >
              Okay
            </a>
          </div>
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
