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
    props.debugBoard();
    const possibleActions = props.piece.getPossibleActions(props.board);
    // console.log(possibleActions);
    return possibleActions;
  };

  const highlight = () => {
    console.log("Highlighting possible piece moves");
    set_highlighted(prevState => {
      const newMatrix = [...prevState];
      console.log("Getting possible piece moves");
      const moves = getMoves();
      console.log("Got possible moves");
      console.log(moves);
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
    console.log("Checking possible moves in this array: ...");
    console.log(props.state.possibleMoves.value[0].currPos);
    for (let action of props.state.possibleMoves.value) {
      console.log("Checking action:");
      console.log(action);
      console.log("Trying to match that action to move:");
      console.log(move);
      const i = action.movePos[0];
      const j = action.movePos[1];
      console.log(`i set to ${i}`);
      console.log(`j set to ${j}`);
      if (move[0] === i && move[1] === j) return action;
    }
    return false;
  };

  const isPossibleDrop = () => {
    console.log("Checking if selected piece is droppable");
    if (isPieceDroppable()) {
      console.log("Checking if move is a good drop");
      if (props.piece === emptySquare) {
        console.log(`${props.boardPosition} is empty`);
        console.log("Returning an action");
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
        console.log(`${props.piece} is not empty:`);
        console.log(props.piece);
        return false;
      }
    } else {
      console.log("selected piece is not droppable");
      return false;
    }
  };

  const core_click_logic = () => {
    console.log("Entered core logic");
    console.log("Checking if a piece is selected");
    if (isPieceSelected()) {
      console.log("Piece selected:");
      console.log(props.state.selected.value);
      const dropAction = isPossibleDrop();
      if (!dropAction) {
        console.log(`Checking if ${props.boardPosition} is moveable`);
        const action = isPossibleMove(props.boardPosition);
        if (action) {
          console.log(`${props.boardPosition} is moveable`);
          console.log("Passing action to move piece");
          props.actions.movePiece(action);
        } else {
          console.log(`${props.boardPosition} not is moveable`);
        }
      } else {
        props.actions.dropPiece(dropAction);
      }
      console.log("Clearing state.");
      clear_state();
      return true;
    }
    // This can be removed ater degubbing
    else {
      console.log("No piece is selected");
      console.log(props.state.selected.value);
      console.log("Exiting core logic");
      return false;
    }
  };

  // When click, need to determine a logic tree
  const handle_click = e => {
    console.log("\n");
    console.log("ENTERING NEW CLICK FUNCTION");
    console.log(`${props.boardPosition} was clicked`);
    console.log("Ensuring promote prompt is not active");
    if (props.state.promotionOption.value) {
      console.log("Promotion option is active");
      console.log("Exiting handleClick");
      console.log("\n");
      return;
    }
    console.log("Promotion option is not active");
    console.log(`Piece type: ${props.piece.constructor.name}`);
    console.log("Checking currently loaded possible actions:");
    console.log(props.state.possibleMoves.value);
    console.log("\n");
    if (!core_click_logic()) {
      console.log("Core logic returned false.");
      console.log("Checking if square is empty.");
      if (props.piece !== emptySquare) {
        console.log("Square is not empty. Selecting piece.");
        select(props.piece);
        highlight();
      } else {
        console.log("Square is empty");
      }
    } else {
      console.log("Core logic returned true.");
    }

    console.log("Exiting handleClick");
    console.log("\n");
  };

  return (
    <div className="cell-wrapper">
      <h3 className="cell" style={getStyles()} onClick={handle_click}>
        {props.piece.toString()}
      </h3>
    </div>
  );
}
