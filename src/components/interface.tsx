import React from "react";
import { State } from "../game/state";
import { CardToAsset } from "../game/data";

type InterfaceProps = {
  gameState: State;
  onDropIdol: () => void;
  onPickUpIdol: () => void;
  onClickChangeParty: () => void;
}

export class Interface extends React.PureComponent<InterfaceProps> {
  render() {
    return <div style={{
      backgroundImage: "url(./assets/caravanui.png)",
      backgroundSize: "cover",
      imageRendering: "pixelated",
      width: 512,
      height: 128,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      margin: "auto"
    }}>
      {/* Party */}
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 150,
        display: 'flex',
        flexDirection: 'row-reverse',
      }}>
        {
          [...this.props.gameState.cardsInCaravan.keys()].map(card => {
            return (
              <div
                style={{
                  display: "inline-block",
                  width: 40,
                  height: 80,
                  margin: "8px 10px 8px 0",
                  backgroundImage: `url(${CardToAsset.get(card.skill)}`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100%',
                  border: "1px solid white",
                  imageRendering: "pixelated",
                }}
              />
            );
          })
        }
        {
          this.props.gameState.canChangeParty() &&
          <button
            style={{
              backgroundColor: "transparent",
              imageRendering: "pixelated",
              width: 150,
              height: "auto",
              padding: 8,
              margin: "auto",
              marginRight: "10px",
              color: "white",
              fontSize: 20,
            }}
            onClick={this.props.onClickChangeParty}
          >
            Change Party
          </button>
        }
      </div>
      {/* Idol */}
      <div style={{
        position: "absolute",
        right: 50,
        bottom: 16,
        width: 64,
        height: 64,
      }}>
        {
          this.props.gameState.hasIdol() &&
          <button
            style={{
              backgroundImage: "url(./assets/idol.png)",
              backgroundSize: "cover",
              backgroundColor: "transparent",
              imageRendering: "pixelated",
              width: 64,
              height: 64,
              padding: 8,
              margin: "auto",
              color: "white",
              fontSize: 20
            }}
            onClick={this.props.onDropIdol}
          >
            <span>Drop</span>
          </button>
        }
        {
          this.props.gameState.canPickUpIdol() && 
          <button 
            onClick={this.props.onPickUpIdol}
            style={{
              backgroundColor: "transparent",
              imageRendering: "pixelated",
              width: 64,
              height: 64,
              padding: 8,
              margin: "auto",
              color: "white",
              fontSize: 20
            }}
          >
            Pick Up
          </button>
        }
      </div>
    </div>;
  }
}
