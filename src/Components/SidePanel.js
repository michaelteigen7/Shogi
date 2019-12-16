import React from "react";
import "./Components.scss";
import PieceStand from "./PieceStand";
import InfoBox from "./InfoBox";

export default function SidePanel(props) {
  const debugWindow = () => {
    return props.color === "white" ? (
      <button onClick={() => console.clear()}>Clear console?</button>
    ) : null;
  };

  return (
    <div id={props.id} className="panel">
      <InfoBox
        promotionOption={props.promotionOption}
        setpromotionOption={props.state.promotionOption.set}
        promotePiece={props.actions.promotePiece}
        selectPiece={props.state.selected.set}
        selectedPiece={props.state.selected.value}
      />
      <div className="timer">{debugWindow()}</div>
      <PieceStand
        pieceStand={props.pieceStand}
        selected={props.state.selected.value}
        select={props.state.selected.set}
        clearHighlights={props.actions.clearHighlights}
        promotionOption={props.state.promotionOption.value}
      />
    </div>
  );
}
