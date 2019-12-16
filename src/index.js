import React, { useState } from "react";
import ReactDOM from "react-dom";
import GameBoard from "./Components/GameBoard";
import SidePanel from "./Components/SidePanel";
import Board, { emptySquare, startBoard } from "./Logic/Game";
import highlightMatrix from "./HighlightMatrix";
import "./main.scss";

function App() {
  // State
  const [board, setBoard] = useState(new Board(startBoard));
  // History is an array of board instances
  const [history, setHistory] = useState([]);
  // Selected is a Piece sub-class instance
  const [selected, select] = useState(null);
  // highlighted is a 9x9 array of booleans
  const [highlighted, setHighlighted] = useState(highlightMatrix);
  // possibleMoves is an array of actions
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [promotionOption, togglePromotionOption] = useState(false);

  const commit_action = (newBoard, overwrite = null) => {
    console.log("Deepcopying board");
    const boardCopy = board.copy();
    console.log(boardCopy);
    console.log("Setting history");
    setHistory(oldHistory => {
      if (overwrite) {
        console.log("Overwriting last history entry");
        const newHistory = [...oldHistory];
        newHistory[newHistory.length-1] = board.copy();
        return newHistory;
      } else return oldHistory.concat(board.copy());
    });
    setBoard(newBoard);
  };

  // console.log(history);

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

    console.log("Deepcopying board");
    const boardCopy = board.copy();
    console.log(boardCopy);

    // Clear the selection
    select(null);

    // Move piece to new position and update the piece's position property
    const newBoard = board.copy();

    // Handle captured piece
    if (action.capture) {
      handle_capture(newBoard.board[iMove][jMove], newBoard);
    }

    newBoard.board[iCurrent][jCurrent] = emptySquare;
    newBoard.board[iMove][jMove] = piece;
    piece.position = [iMove, jMove];
    commit_action(newBoard);
    
    setLastMove(action);
    if (action.promote) {
      togglePromotionOption(true);
    }
  };

  const promote_piece = () => {
    const i = lastMove.movePos[0];
    const j = lastMove.movePos[1];

    const newBoard = board.copy();
    newBoard.board[i][j].isPromoted = true;

    commit_action(newBoard, true);
  };

  const drop_piece = action => {
    const getPieceColor = piece => (piece.isBlack ? "black" : "white");
    const i = action.movePos[0];
    const j = action.movePos[1];
    const newBoard = board.copy();
    newBoard.board[i][j] = selected;
    newBoard.pieceStands[getPieceColor(selected)][
      selected.getPieceType()
    ].shift();
    commit_action(newBoard);
  };

  // Object holds functions without return values
  const actions = {
    movePiece: move_piece,
    promotePiece: promote_piece,
    dropPiece: drop_piece,
    clearHighlights: () => setHighlighted(highlightMatrix)
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
