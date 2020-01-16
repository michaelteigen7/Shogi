import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import GameBoard from "./Components/GameBoard";
import SidePanel from "./Components/SidePanel";
import Board, { startBoard } from "./Logic/Game";
import highlightMatrix from "./Components/HighlightMatrix";
import { GameVAI, ReviewMode } from "./Mode"
import "./main.scss";

/*
TODOS:
-Engine
-Promote option is not passed to the engine
-Loading a board breaks the app
-Player is currently allowed to move opponenets pieces in versus mode
-Need to adjust gameboard logic to apply to player and opponent
  logic rather than binding board orientation to black and white
*/

function App() {
  const localStartBoard = new Board(startBoard);
  
  // State
  const [board, setBoard] = useState(localStartBoard);
  // Mode is a game-flow-control object
  const [mode, setMode] = useState(new ReviewMode(localStartBoard));
  // Selected is a Piece sub-class instance: it is a direct reference
  // to the selected piece
  const [selected, select] = useState(null);
  // highlighted is a 9x9 array of booleans
  const [highlighted, setHighlighted] = useState(highlightMatrix);
  // possibleMoves is an array of actions
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [promotionOption, togglePromotionOption] = useState(false);

  const move_piece = action => {
    select(null); // Clear the selection
    setLastMove(action); // record the last action for a promotion option
    const newBoard = board.move_piece(action);
    setBoard(newBoard); // update the rendered board
    // set the promotion option
    if (action.promote) {
      mode.promoOptionActive = true;
      togglePromotionOption(true);
      return null;
    } else return newBoard;
  };

  const promote_piece = acceptPromote => {
    let newBoard;
    if (acceptPromote) {
      newBoard = board.promote_piece(lastMove);
      setBoard(newBoard);
    }
    else {
      newBoard = board.copy();
      setBoard(newBoard);
    }
    mode.promoOptionActive = false;
    mode.isPlayersTurn = false;
    return newBoard;
  };

  const drop_piece = action => {  
    const newBoard = board.drop_piece(action);
    setBoard(newBoard);
    return newBoard;
  };

  useEffect(() => {
    // Executed when it's not the player's turn and opponent is the AI
    if (mode && mode instanceof GameVAI && mode.gameInProgress && 
    !mode.isPlayersTurn) {
      const actionRefs = {move: move_piece, drop: drop_piece};
      mode.take_turn(null, actionRefs, board);
    }
  });

  // Object holds functions without return values
  const actions = {
    do_action: action => mode.take_turn(action),
    movePiece: move_piece,
    promotePiece: promote_piece,
    dropPiece: drop_piece,
    clearHighlights: () => setHighlighted(highlightMatrix),
    create_game: () => {
      // Player will go first by default
      const playerIsBlack = true;
      const newBoard = new Board(startBoard);
      const newMode = new GameVAI(playerIsBlack, newBoard);
      setBoard(newBoard);
      newMode.start_game();
      setMode(newMode);
    },
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
        state={state}
        actions={actions}
        color={"black"}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
