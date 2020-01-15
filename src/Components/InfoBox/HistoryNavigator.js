import React from "react";

export default function HistoryNavigator(props) {
  const next = () => {
    const newBoard = props.history.next();
  }

  const setBoardFromHistory = board => {
    if (board) props.board.set(board);
  }

  return props.color === "white" ? 
    (
      <div id="move-navigator">
        <button
          onClick={ () => setBoardFromHistory(props.history.previous()) }
        >Previous</button>
        <button
          onClick={ () => setBoardFromHistory(props.history.next()) }
        >Next</button>
      </div>
    ) 
    : null;
}