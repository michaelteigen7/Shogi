import React from "react";
import "./Components.scss";
import { emptySquare } from "../Logic/Game";
import highlightMatrix from "./HighlightMatrix";
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

  const highlight = () => {
    set_highlighted(prevState => {
      const newMatrix = [...prevState];
      const moves = props.piece.getPossibleActions(props.board);
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
      // Check whether the clicked cell is in the possible moves list
      // of the selected piece
      const i = action.movePos[0];
      const j = action.movePos[1];
      if (move[0] === i && move[1] === j) {
        return action;
      };
    }
    return false;
  };

  const getPossibleDrop = () => {
    if (isPieceDroppable() && props.piece === emptySquare) {
      // Create a drop option
      const selectedPiece = props.state.selected.value;
      return new Action({
        currPos: selectedPiece,
        movePos : props.boardPosition,
        capture: false,
        drop: true,
        promote: false,
        pieceType: selectedPiece.getPieceType(),
        pieceColor: selectedPiece.getColor()
      });
    } else return false;
  };

  const getMoveLogic = () => {
    let logic = null;
    const dropAction = getPossibleDrop();
    if (!dropAction) {
      const action = isPossibleMove(props.boardPosition);
      if (action) {
        logic = () => props.actions.movePiece(action);
      }
    } else {
      logic = () => props.actions.dropPiece(dropAction);
    }
    clear_state();
    return logic;
  }

  const click_logic = () => {
    const playerCanMoveOpponentPiece = () => {
      const mode = props.state.mode.value;
      return !mode || !mode.gameInProgress
    }
    const canSelectPiece = () => {
    // return true if a friendly piece isn't selected and if the 
    // clicked square isn't empty
      const piece = props.piece;
      return (
        !isPieceSelected() &&
        piece !== emptySquare &&
        ( 
          playerCanMoveOpponentPiece() ||
          piece.isBlack === props.state.playerMovesBlack.value
        )
      );
    }
    const ignoreClick = () => {
      const piece = props.piece;
      return (
        // return true if no piece is selected
          (piece === emptySquare && props.state.selected.value === null) ||
        // return true if a friendly piece is selected and the 
        // clicked square is that same piece
          props.piece === props.state.selected.value ||
        // return true if a game is in progress, and the player
        // clicked on an opponent's piece 
        (
          !playerCanMoveOpponentPiece() &&
          piece !== emptySquare &&
          piece.isBlack !== props.state.playerMovesBlack.value
        )
      );
    }

    if (canSelectPiece()) {
      select(props.piece);
      highlight();
      return false;
    } 
    else if (ignoreClick()) {
      clear_state();
      return false;
    }
    else {
      return true;
    }
  };

  // When click, need to determine a logic tree
  const canClick = () => {
    const mode = props.state.mode.value;
    if (mode && mode.gameInProgress && !mode.isPlayersTurn) {
      console.log("It's not your turn!");
      return false;
    }
    // Player must choose whether to promote before taking another action
    return !props.state.promotionOption.value;
  }

  const handle_click = e => {
    if (canClick() && click_logic()) {
      props.actions.do_action(getMoveLogic());
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
