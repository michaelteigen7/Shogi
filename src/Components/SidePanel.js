import React from "react";
import "./Components.scss";
import PieceStand from "./PieceStand";
import InfoBox from "./InfoBox";

export default function SidePanel(props) {
  return (
    <div id={props.id} className="panel">
      <InfoBox
        promotionOption={props.promotionOption}
        setpromotionOption={props.state.promotionOption.set}
        promotePiece={props.actions.promotePiece}
        selectPiece={props.state.selected.set}
        selectedPiece={props.state.selected.value}
        color={props.color}
        history={props.state.mode.value.history}
        setBoard={props.state.board.set}
      />
      <div className="timer"></div>
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
