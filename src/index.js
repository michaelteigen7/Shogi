import React, { useState } from "react";
import ReactDOM from "react-dom";
import GameBoard from "./Components/GameBoard";
import SidePanel from "./Components/SidePanel";
import Board, { emptySquare, startBoard } from "./Logic/Game";
import highlightMatrix from "./HighlightMatrix";
import "./main.scss";

// NEED TO IMPLEMENT:
/*
-Drops
 */

function App() {
  // State
  const [board, setBoard] = useState(new Board(startBoard));
  // History is an array of board instances
  const [history, setHistory] = useState([board]);
  // Selected is a Piece sub-class instance
  const [selected, select] = useState(null);
  // highlighted is a 9x9 array of booleans
  const [highlighted, setHighlighted] = useState(highlightMatrix);
  // possibleMoves is an array of actions
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [promotionOption, togglePromotionOption] = useState(false);

  const commit_action = newBoard => {};

  // Add a piece to the opposing player's piece stand
  const handle_capture = (piece, newBoard) => {
    console.log("ENTERED handle_capture FUNCTION");
    console.log("Board passed in:");
    console.log(newBoard);
    const color = piece.isBlack ? "white" : "black";
    console.log(`Setting ${color}'s piecestand`);
    console.log("Before:");
    console.log(newBoard.pieceStands[color]);

    console.log("Changing piece properties");
    piece.position = [null, null]; // Piece board doesn't have a board position
    piece.isPromoted = false;
    piece.isBlack = !piece.isBlack; // Flip piece ownership

    console.log(`${color}'s piece stand for ${[piece.getPieceType()]}s`);
    console.log(newBoard.pieceStands[color][piece.getPieceType()]);
    console.log(`white's piece stand for ${[piece.getPieceType()]}s`);
    console.log(newBoard.pieceStands["white"][piece.getPieceType()]);

    const pieceStands = newBoard.pieceStands;
    console.log("Piece Stands:");
    console.log(pieceStands);
    pieceStands[color][piece.getPieceType()].push(piece);
    console.log("After");

    console.log(`${color}'s piece stand for ${[piece.getPieceType()]}s`);
    console.log(newBoard.pieceStands[color][piece.getPieceType()]);
    console.log(`white's piece stand for ${[piece.getPieceType()]}s`);
    console.log(newBoard.pieceStands["white"][piece.getPieceType()]);

    console.log(newBoard.pieceStands[color]);
    console.log("Captured piece:");
    console.log(piece);
  };

  const move_piece = action => {
    console.log("\n");
    console.log("Entered movePiece function".toUpperCase());
    // Get references
    const iCurrent = action.currPos[0];
    const jCurrent = action.currPos[1];
    const iMove = action.movePos[0];
    const jMove = action.movePos[1];
    const piece = board.board[iCurrent][jCurrent];

    // Clear the selection
    console.log("Clearing selection");
    select(null);
    console.log("Old board before setBoard");
    console.log(board.board);

    // Move piece to new position and update the piece's position property
    setBoard(prevBoard => {
      const oldBoard = prevBoard;
      console.log("Old board");
      console.log(prevBoard.board);
      const newBoard = new Board(oldBoard.board, oldBoard.pieceStands);
      console.log("Copied old board to new board instance");
      console.log(newBoard);

      setHistory(oldHistory => oldHistory.push(oldBoard));
      console.log("Copied old board to history")

      // Handle captured piece
      if (action.capture) {
        console.log("Handling capture piece");
        handle_capture(newBoard.board[iMove][jMove], newBoard);
      }

      console.log("Clearing move-from square");
      newBoard.board[iCurrent][jCurrent] = emptySquare;
      console.log(`Setting board[${iMove}][${jMove}] to ${piece}`);
      newBoard.board[iMove][jMove] = piece;
      console.log(newBoard.board);
      console.log("Updating piece");
      piece.position = [iMove, jMove];
      console.log("Setting board to new board");
      return newBoard;
    });

    console.log("Recording action.");
    setLastMove(action);
    if (action.promote) {
      console.log("triggering promotion option");
      togglePromotionOption(true);
    }
  };

  const promote_piece = () => {
    const i = lastMove.movePos[0];
    const j = lastMove.movePos[1];
    console.log(`Promoting piece at ${i}, ${j}`);
    setBoard(oldBoard => {
      const newBoard = new Board(oldBoard.board, oldBoard.pieceStands);
      newBoard.board[i][j].isPromoted = true;

      setHistory(oldHistory => {
        const newHistory = [...oldHistory];
        console.log("Overwriting last board position with promoted piece");
        newHistory[newHistory.length-1] = newBoard;
        return newHistory;
      });
      return newBoard;
    });
  };

  const drop_piece = action => {
    const getPieceColor = piece => (piece.isBlack ? "black" : "white");
    const i = action.movePos[0];
    const j = action.movePos[1];
    setBoard(oldBoard => {
      const newBoard = new Board(oldBoard.board, oldBoard.pieceStands);
      console.log(`Dropping piece at [${i}, ${j}]`);
      console.log("Board before");
      console.log(newBoard);
      newBoard.board[i][j] = selected;
      console.log(`Popping piece from ${getPieceColor(selected)} piecestand.`);
      newBoard.pieceStands[getPieceColor(selected)][
        selected.getPieceType()
      ].shift();
      console.log("Popping from:");
      console.log(newBoard.pieceStands[getPieceColor(selected)]);
      console.log("Board after");
      console.log(newBoard);
      return newBoard;
    });
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
        debugBoard={() => board.print()}
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
