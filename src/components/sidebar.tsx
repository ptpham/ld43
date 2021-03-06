import React from "react";
import { State } from "../game/state";

type SidebarProps = {
  gameState   : State;
  onDropIdol  : () => void;
  onPickUpIdol: () => void;
  onDoEvent   : () => void;
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
      canPickUpIdol = !state.hasWon && state.idolState.node.equals(state.caravanLocation);
    }

    const hasIdol = this.props.gameState.hasIdol();
    const idolAction: IdolAction = 
      hasIdol
        ? "Drop"
        : canPickUpIdol
          ? "Pick Up"
          : "None";


    const mousedOverLoc = this.props.gameState.mousedOverLocation;
    const selectedLoc   = this.props.gameState.selectedNextLocation
    const location      = mousedOverLoc || selectedLoc;

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
          this.props.gameState.items.size > 0 &&
            <div
              style={{
                paddingTop: "20px",
              }}
            >
              <div>
                <strong>Items</strong>
              </div>

              {
                [...this.props.gameState.items.keys()].map(item => {
                  return (
                    <div>
                      { item }
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
                  paddingTop: "20px",
                }}
              >
                <strong>Currently { mousedOverLoc ? "hovered" : "selected" } location:</strong>
              </div>

              <div
                style = {{
                  paddingBottom: "20px",
                }}
              >
                <div>
                  Type: { location.node.locationType }
                </div>
              </div>
            </>
        }
      </div>
    );
  }
}
