
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

  renderCost(opt: EventOption): {
    node    : React.ReactNode; 
    cantBuy?: boolean;
  } {
    let to_ret: { node    : React.ReactNode; cantBuy?: boolean; }[] = [];
    if (opt.outcome) {
      const outcomes = Array.isArray(opt.outcome) ? opt.outcome : [opt.outcome];
      const meatOutcome = outcomes.filter(x => x.type === "gain-meat" || x.type === "lose-meat")[0];

      if (meatOutcome) {
        if (meatOutcome.type === "gain-meat") {
          if (meatOutcome.hidden) {
            to_ret.push( { node: null });
          } else {
            to_ret.push({
              node: (
                <span style={{ color: "#00cc00" }}>
                  +{ meatOutcome.amount } meat
                </span>
              ),
            });
          }
        } else if (meatOutcome.type === "lose-meat") {
          if (meatOutcome.hidden) {
            to_ret.push({ node: null });
          } else {
            //to_ret.push((
            //  <span style={{ color: "red" }}>
            //    -{ meatOutcome.amount } meat
            //  </span>
            //))
            to_ret.push({
              node: (
                <span style={{ color: "red" }}>
                  -{ meatOutcome.amount } meat
                </span>
              ),
              cantBuy: this.props.gameState.meat < meatOutcome.amount,
            });
          }
        } else {
          throw new Error("should be impossible! " + meatOutcome);
        }
      }

      const sacrificeOutcome = outcomes.filter(x => x.type === 'lose-member-weak' || x.type === 'lose-member-strong')[0];
      if (sacrificeOutcome) {
        if (sacrificeOutcome.type === 'lose-member-weak') {
          to_ret.push({
            node: 
              <span style={{ color: "red "}}>
                Lose { sacrificeOutcome.skill } temporarily.
              </span>
          });
        } else if (sacrificeOutcome.type === 'lose-member-strong') {
          to_ret.push({
            node: 
              <span style={{ color: "red "}}>
                Lose { sacrificeOutcome.skill } permanently.
              </span>
          });
        } else {
          throw new Error("should be impossible! " + sacrificeOutcome);
        }
      }
    }

    return {
      node: (
        <span>
          { to_ret.map((x, i) => { return i ===0 ? x.node : (
            <span>
              {', '} {x.node}
            </span>
         ) }) }
        </span>
      ),
      cantBuy: to_ret.reduce((pv, cv) => (pv || (cv.cantBuy || false)), false)
    }
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
    const { node: costNode, cantBuy } = this.renderCost(option);

    if (renderNothingElse) {
      return (
        <EventButton disabled>
          { requirement }
        </EventButton>
      );
    }

    if (cantBuy) {
      return (
        <EventButton disabled>
          <div>
            { requirement }{' '}
            { option.description }{' '}
            { costNode }
          </div>
          <div>
            Too expensive!
          </div>
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
          { costNode }
        </span>
      </EventButton>
    );
  }

  renderDialogContent(): React.ReactNode {
    if (this.state.mode.type === "choice") {
      const options = this.props.event.options;

      const everyOptionCostsMoney = options.every(x => {
        return x.outcome.some(outcome => 
          outcome.type === "lose-meat" ||
          (outcome.type === "gain-meat" && outcome.hidden)
        )
      });

      const everyOptionTooExpensive = options.every(x => {
        return x.outcome.some(outcome => 
          outcome.type === "lose-meat" && 
          outcome.amount >= this.props.gameState.meat
        );
      });

      const turnBackOption: EventOption = {
        skillRequired: { type: "no-skill" },
        description  : "Turn back.",
        followUpText : "",
        outcome      : [{ type: "turn-back" }],
      };

      const regroupOption: EventOption = {
        skillRequired: { type: "no-skill" },
        description  : "We're running out of meat! Return to hometown and regroup.",
        followUpText : "",
        outcome      : [{ type: "end-run" }],
      };

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

          {
            everyOptionCostsMoney &&
              this.renderButton(turnBackOption)
          }

          {
            everyOptionTooExpensive &&
              this.renderButton(regroupOption)
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

              if (outcome.type === "turn-back") {
                return (
                  <div
                    style={{
                      backgroundColor: "yellow",
                    }}
                  >
                    You run back!
                  </div>
                )
              }


              if (outcome.type === "lose-member-strong") {
                return (
                  <div
                    style={{
                      backgroundColor: "pink",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You have permanently left behind your { outcome.skill }.
                  </div>
                )
              }

              if (outcome.type === "lose-member-weak") {
                return (
                  <div
                    style={{
                      backgroundColor: "pink",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You have left behind your { outcome.skill }. (S)he will return home alone.
                  </div>
                )
              }

              if (outcome.type === "end-run") {
                return (
                  <div
                    style={{
                      backgroundColor: "lightblue",
                      padding: "5px",
                      margin: "10px 0 0 0"
                    }}
                  >
                    You have run out of food, so you return to your hometown to regroup.
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
