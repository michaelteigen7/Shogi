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
-Engine to read three moves ahead
-Need to adjust gameboard logic to apply to player and opponent
  logic rather than binding board orientation to black and white
*/

function App() {
  const localStartBoard = new Board(startBoard);
  
  // State
  const [board, setBoard] = useState(localStartBoard);
  // Mode is a game-flow-control object
  const [mode, setMode] = useState(new ReviewMode(localStartBoard));
  // selected is a Piece sub-class instance: it is a direct reference
  // to the selected piece
  const [selected, select] = useState(null);
  // highlighted is a 9x9 array of booleans. Will highlight possible
  // piece moves on the board when a piece is selected
  const [highlighted, setHighlighted] = useState(highlightMatrix);
  // possibleMoves is an array of actions
  const [possibleMoves, setPossibleMoves] = useState([]);
  // Front end needs to save the last action and offer the player 
  // an option to promote a piece when necessary
  const [lastMove, setLastMove] = useState(null);
  const [promotionOption, togglePromotionOption] = useState(false);
  // By default, player will play black for now
  const [playerMovesBlack, setBlackPlayer] = useState(false);

  const move_piece = action => {
    // Clear the selection
    select(null);
    // record the last action for a promotion option
    setLastMove(action);
    const newBoard = board.move_piece(action);
    // update the rendered board
    setBoard(newBoard);
    // set the promotion option
    if (action.promote && action.actorIsPlayer) {
      mode.promoOptionActive = true;
      togglePromotionOption(true);
      return null;
    } else return newBoard;
  };

  const drop_piece = action => {  
    const newBoard = board.drop_piece(action);
    setBoard(newBoard);
    return newBoard;
  };

  const promote_player_piece = acceptPromote => {
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

  const opponent_promote_move = action => {
    let newBoard = board.move_piece(action);
    newBoard = newBoard.promote_piece(action);
    setBoard(newBoard);
    return newBoard;
  }

  useEffect(() => {
    // Executed when it's not the player's turn and opponent is the AI
    if (mode && mode instanceof GameVAI && mode.gameInProgress && 
    !mode.isPlayersTurn) {
      const commands = {
        move: move_piece, 
        promotePiece: opponent_promote_move, 
        drop: drop_piece
      };
      mode.take_turn(null, commands, board);
    }
  });

  // Object holds functions without return values
  const actions = {
    do_action: action => mode.take_turn(action),
    movePiece: move_piece,
    promotePiece: promote_player_piece,
    dropPiece: drop_piece,
    clearHighlights: () => setHighlighted(highlightMatrix),
    create_game: () => {
      const newBoard = new Board(startBoard);
      const newMode = new GameVAI(playerMovesBlack, newBoard);
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
    },
    playerMovesBlack: {
      value: playerMovesBlack,
      set: setBlackPlayer
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
