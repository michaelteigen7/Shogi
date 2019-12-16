import React from "react";
import "./Components.scss";
import { emptySquare } from "../Logic/Game";
import highlightMatrix from "../HighlightMatrix.js";
import Action from "../Logic/Action";

export default function GamePiece(props) {
  // Local references to actions
  const set_possible_moves = props.state.possibleMoves.set;
  const set_highlighted = props.state.highlighted.set;

  const select = cell => {
    if (cell === emptySquare || !cell) {
      props.state.selected.set(null);
    } else {
      props.state.selected.set(cell);
    }
  };

  const getStyles = () => {
    const style = {};
    if (!props.piece.isBlack) style["transform"] = "rotate(-180deg)";
    if (props.piece.isPromoted) style["color"] = "red";
    if (props.selected) {
      style["opacity"] = "0.6";
    }
    if (props.highlighted) {
      style["opacity"] = "0.3";
      style["backgroundColor"] = "lightgrey";
    }
    if (props.piece && props.piece !== emptySquare) style["cursor"] = "pointer";
    return style;
  };

  const getMoves = () => {
    const possibleActions = props.piece.getPossibleActions(props.board);
    return possibleActions;
  };

  const highlight = () => {
    set_highlighted(prevState => {
      const newMatrix = [...prevState];
      const moves = getMoves();
      set_possible_moves(moves);
      moves.forEach(move => {
        const i = move.movePos[0];
        const j = move.movePos[1];
        newMatrix[i][j] = true;
      });
      return newMatrix;
    });
  };

  const clear_state = () => {
    select(null);
    set_highlighted(highlightMatrix());
    return;
  };

  const isPieceSelected = () => props.state.selected.value !== null;
  const isPieceDroppable = () =>
    props.state.selected.value.position[0] === null;

  const isPossibleMove = move => {
    for (let action of props.state.possibleMoves.value) {
      const i = action.movePos[0];
      const j = action.movePos[1];
      if (move[0] === i && move[1] === j) return action;
    }
    return false;
  };

  const isPossibleDrop = () => {
    if (isPieceDroppable()) {
      if (props.piece === emptySquare) {
        const selectedPiece = props.state.selected.value;
        const capture = false;
        const drop = true;
        return new Action(
          selectedPiece.position,
          props.boardPosition,
          capture,
          drop,
          selectedPiece.getPieceType()
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const core_click_logic = () => {
    if (isPieceSelected()) {
      const dropAction = isPossibleDrop();
      if (!dropAction) {
        const action = isPossibleMove(props.boardPosition);
        if (action) {
          props.actions.movePiece(action);
        }
      } else {
        props.actions.dropPiece(dropAction);
      }
      clear_state();
      return true;
    }
    // This can be removed ater degubbing
    else {
      return false;
    }
  };

  // When click, need to determine a logic tree
  const handle_click = e => {
    if (props.state.promotionOption.value) {
      return;
    }
    if (!core_click_logic()) {
      if (props.piece !== emptySquare) {
        select(props.piece);
        highlight();
      }
    }
  };

  return (
    <div className="cell-wrapper">
      <h3 className="cell" style={getStyles()} onClick={handle_click}>
        {props.piece.toString()}
      </h3>
    </div>
  );
}
