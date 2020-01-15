import React from "react";
import "./Components.scss";
import PieceStand from "./PieceStand";
import InfoBox from "./InfoBox/InfoBox";

export default function SidePanel(props) {
  return (
    <div id={props.id} className="panel">
      <InfoBox
        history={props.state.mode.value.history}
        board={props.state.board}
        state={props.state}
        actions={props.actions}
        color={props.color}
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
