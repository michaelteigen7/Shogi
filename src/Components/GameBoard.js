import React from "react";
import GamePiece from "./GamePiece";
import "./Components.scss";

export default function GameBoard(props) {
  return (
    <div id="board-wrapper">
      <div id="board">
        {props.board.map((row, x) =>
          row.map((piece, y) => {
            const highlights = props.state.highlighted.value
              ? props.state.highlighted.value[x][y]
              : null;

            const selected =
              props.state.selected.value &&
              props.state.selected.value.position[0] === x &&
              props.state.selected.value.position[1] === y;

            return (
              <GamePiece
                key={`${x},${y}`}
                boardPosition={[x, y]}
                board={props.board}
                piece={piece}
                selected={selected}
                highlighted={highlights}
                state={props.state}
                actions={props.actions}
                debugBoard={props.debugBoard}
              />
            );
          })
        )}
      </div>
      <button 
        id="start-btn" 
        onClick={() => props.actions.create_game()}
      >
        Start Game
      </button>
    </div>
  );
}
