import React from "react";
import { State } from "../game/state";
import { Card } from "../components/card";

type InterfaceProps = {
  gameState: State;
  onDropIdol: () => void;
  onPickUpIdol: () => void;
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
      }}>
        {
          [...this.props.gameState.cardsInCaravan.keys()].map(card => {
            return (
              <Card
                card={card}
                gameState={this.props.gameState}
                onChangeSelection={() => {}}
                hideContents
                style={{
                  width: 40,
                  height: 80,
                  margin: "5px 10px",
                }}
              />
            );
          })
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
