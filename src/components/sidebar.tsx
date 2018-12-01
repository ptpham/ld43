import React from "react";
import { State } from "../game/state";

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

    }
  }

  public render(): JSX.Element {
    let canPickUpIdol = false;
    const state = this.props.gameState;

    if (state.idolState.state === "dropped") {
      canPickUpIdol = state.idolState.node === state.caravan_location;
    }

    const idolAction: IdolAction = 
      this.props.gameState.hasIdol
        ? "Drop"
        : canPickUpIdol
          ? "Pick Up"
          : "None";

    return (
      <div
        style={{
          display: "inline-block",
          verticalAlign: "top",
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
          You <strong>{ this.props.gameState.hasIdol ? "have" : "don't have" }</strong> the idol.
          {' '}
          <a 
            href="javascript:;"
            onClick={ () => this.clickDropOrPickUp(idolAction) }
          >
            {
            }
          </a>
        </div>
        <div>
          { "Currently selected location: " + (this.props.gameState.selectedNextLocation ? this.props.gameState.selectedNextLocation.node.locationType : "None. ")}
        </div>
      </div>
    );
  }
}
