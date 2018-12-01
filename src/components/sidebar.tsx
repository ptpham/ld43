import React from "react";
import { State } from "../game/state";
import {LocationTypeData} from "../game/data";

type SidebarProps = {
  gameState   : State;
  onDropIdol  : () => void;
  onPickUpIdol: () => void;
}

type SidebarState = {
}

type IdolAction = 
  | "Drop"
  | "Pick Up"
  | "None"

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);

    this.state = { };
  }

  private clickDropOrPickUp(action: IdolAction): void {
    if (action === "Drop") {
      this.props.onDropIdol();
    } else if (action === "Pick Up") {
      this.props.onPickUpIdol();
    } else if (action === "None") {
      return;
    }
  }

  public render(): JSX.Element {
    let canPickUpIdol = false;
    const state = this.props.gameState;

    if (state.idolState.state === "dropped") {
      canPickUpIdol = state.idolState.node.equals(state.caravan_location);
    }

    const hasIdol = this.props.gameState.hasIdol();
    const idolAction: IdolAction = 
      hasIdol
        ? "Drop"
        : canPickUpIdol
          ? "Pick Up"
          : "None";

    const location = this.props.gameState.selectedNextLocation;

    return (
      <div
        style={{
          display: "inline-block",
          verticalAlign: "top",
          padding: "10px",
        }}
      >
        <div 
          style={{
            paddingBottom: "10px",
          }}
        >
          <strong>Game Status</strong>
        </div>

        <div
          style={{
            paddingBottom: "20px",
          }}
        >
          You <strong>{ this.props.gameState.hasIdol() ? "have" : "don't have" }</strong> the idol.
          {' '}
          <a 
            href="javascript:;"
            onClick={ () => this.clickDropOrPickUp(idolAction) }
          >
            {
              idolAction === "None" ? "" : idolAction
            }
          </a>
        </div>

        {
          this.props.gameState.cardsInCaravan.size > 0 &&
            <div>
              <div>
                <strong>Party</strong>
              </div>

              {
                [...this.props.gameState.cardsInCaravan.keys()].map(card => {
                  return (
                    <div>
                      { card.skill }
                    </div>
                  );
                })
              }
            </div>
        }

        {
          location &&
            <>
              <div
                style = {{
                  paddingBottom: "20px",
                }}
              >
                <strong>Currently selected location:</strong>
              </div>

              <div
                style = {{
                  paddingBottom: "20px",
                }}
              >
                <div>
                  Type: { location.node.locationType }
                </div>
                <div>
                  Meat Cost: { location.node.meatCostExplanationString(this.props.gameState) }
                </div>
                <div>
                  { "Sacrifice Cost: " + (LocationTypeData[location.node.locationType] || { targetSkill: 'None'}).targetSkill }
                </div>
              </div>
            </>
        }
      </div>
    );
  }
}
