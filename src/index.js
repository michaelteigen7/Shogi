import React, { useState } from "react";
import ReactDOM from "react-dom";
import GameBoard from "./Components/GameBoard";
import SidePanel from "./Components/SidePanel";
import Board, { emptySquare, startBoard } from "./Logic/Game";
import highlightMatrix from "./HighlightMatrix";
import hash_board from "./Logic/HistoryTree";
import {GameVAI, ReviewMode} from "./Mode"
import "./main.scss";


/*
TODOS:
-Fix Bug: moving out of the promotion zone does not offer a promotion option
-Game mode
-History control
*/

function App() {
  // State
  const [board, setBoard] = useState(new Board(startBoard));
  // Mode is a game-flow-control object
  const [mode, setMode] = useState(new ReviewMode());
  // Selected is a Piece sub-class instance: it is a direct reference
  // to the selected piece
  const [selected, select] = useState(null);
  // highlighted is a 9x9 array of booleans
  const [highlighted, setHighlighted] = useState(highlightMatrix);
  // possibleMoves is an array of actions
  const [possibleMoves, setPossibleMoves] = useState([]);
  // Last move is a temporary variable until history control
  // is properly implemented. It's only present use is
  // in piece promotion
  const [lastMove, setLastMove] = useState(null);
  const [promotionOption, togglePromotionOption] = useState(false);

  // Add a piece to the opposing player's piece stand
  const handle_capture = (piece, newBoard) => {
    const color = piece.isBlack ? "white" : "black";

    piece.position = [null, null]; // Piece doesn't have a board position
    piece.isPromoted = false;
    piece.isBlack = !piece.isBlack; // Flip piece ownership

    const pieceStands = newBoard.pieceStands;
    pieceStands[color][piece.getPieceType()].push(piece);
  };

  const move_piece = action => {
    // Get references
    const iCurrent = action.currPos[0];
    const jCurrent = action.currPos[1];
    const iMove = action.movePos[0];
    const jMove = action.movePos[1];
    const piece = board.board[iCurrent][jCurrent];

    // Clear the selection
    select(null);

    // Need to shallow-copy old board for state update
    const newBoard = board.shallowCopy();

    // Handle captured piece
    if (action.capture) {
      handle_capture(newBoard.board[iMove][jMove], newBoard);
    }

    // Move piece to new position and update the piece's position property
    newBoard.board[iCurrent][jCurrent] = emptySquare;
    newBoard.board[iMove][jMove] = piece;
    piece.position = [iMove, jMove];

    setBoard(newBoard);
    setLastMove(action);
    if (action.promote) {
      togglePromotionOption(true);
    }
  };

  const promote_piece = () => {
    const i = lastMove.movePos[0];
    const j = lastMove.movePos[1];

    const newBoard = board.shallowCopy();
    newBoard.board[i][j].isPromoted = true;

    setBoard(newBoard);
  };

  const drop_piece = action => {
    const getPieceColor = piece => (piece.isBlack ? "black" : "white");
    
    // Get target square board coordinates
    const i = action.movePos[0];
    const j = action.movePos[1];
    const newBoard = board.shallowCopy();
    
    // Place the piece on the new board
    newBoard.board[i][j] = selected;
    
    // Remove a piece of the selected piece type off the piecestand
    newBoard.pieceStands[getPieceColor(selected)][
      selected.getPieceType()
    ].shift();
    
    setBoard(newBoard);
  };

  // Object holds functions without return values
  const actions = {
    movePiece: move_piece,
    promotePiece: promote_piece,
    dropPiece: drop_piece,
    clearHighlights: () => setHighlighted(highlightMatrix),
    create_game: () => setMode(new GameVAI()),
    do_action: action => mode.do_action(action, board)
  };

  // Object holds references to states and state updaters
  const state = {
    board: {
      value: board,
      set: setBoard
    },
    selected: {
      value: selected,
      set: select
    },
    highlighted: {
      value: highlighted,
      set: setHighlighted
    },
    possibleMoves: {
      value: possibleMoves,
      set: setPossibleMoves
    },
    promotionOption: {
      value: promotionOption,
      set: togglePromotionOption
    },
    mode: {
      value: mode,
      set: setMode
    }
  };

  return (
    <div className="App">
      <SidePanel
        id="left-panel"
        pieceStand={board.pieceStands.white}
        selected={selected}
        state={state}
        actions={actions}
        color={"white"}
      />
      <GameBoard
        board={board.board}
        selected={selected}
        state={state}
        actions={actions}
      />
      <SidePanel
        id="right-panel"
        pieceStand={board.pieceStands.black}
        selected={selected}
        state={state}
        actions={actions}
        promotionOption={promotionOption}
        color={"black"}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
