import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import GameBoard from "./Components/GameBoard";
import SidePanel from "./Components/SidePanel";
import Board, { startBoard } from "./Logic/Game";
import highlightMatrix from "./HighlightMatrix";
import { GameVAI, ReviewMode } from "./Mode"
import "./main.scss";


/*
TODOS:
-Game mode
  -Caturing and promoting pieces is currently broken in game mode
  -Promote option is currently not passed to the engine
  -Need to adjust gameboard logic to apply to player and opponent
   logic rather than binding board orientation to black and white
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

  const move_piece = action => {
    select(null); // Clear the selection
    setLastMove(action); // record the last action for a promotion option
    setBoard(board.move_piece(action)); // update the rendered board
    // set the promotion option
    if (action.promote) {
      mode.promoOptionActive = true;
      togglePromotionOption(true);
    }
  };

  const promote_piece = acceptPromote => {
    if (acceptPromote) {
      setBoard(board.promote_piece(lastMove));
    }
    else {
      setBoard(board.copy());
    }
    mode.promoOptionActive = false;
    mode.isPlayersTurn = false;
  };

  const drop_piece = action => {  
    setBoard(board.drop_piece(action));
  };

  // Object holds functions without return values
  const actions = {
    movePiece: move_piece,
    promotePiece: promote_piece,
    dropPiece: drop_piece,
    clearHighlights: () => setHighlighted(highlightMatrix),
    create_game: () => {
      // Player will go first by default
      const playerIsBlack = true;
      const newMode = new GameVAI(playerIsBlack);
      setBoard(new Board(startBoard));
      newMode.start_game();
      setMode(newMode);
    },
    do_action: action => mode.take_turn(action)
  };

  useEffect(() => {
    // Executed when it's not the player's turn and opponent is the AI
    if (mode && mode instanceof GameVAI && mode.gameInProgress && 
    !mode.isPlayersTurn) {
      const choices = board.getEngineActionChoices(false);
      const actionRefs = {move: move_piece, drop: drop_piece};
      mode.take_turn(null, actionRefs, board);
    }
  }, [board, mode]);

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
