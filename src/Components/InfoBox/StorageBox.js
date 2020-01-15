import React from "react";
import { saveBoard, loadBoard } from "../../Storage/StorageAPI";
import Board, { parseJSON } from "../../Logic/Game";

export default function StorageBox(props) {
  const save_board = () => {
    const preservePieceType = true;
    const result = saveBoard(props.board.value.copy(preservePieceType));
    if (result === true) console.log("Board saved");
  }

  const load_board = () => {
    const savedBoard = loadBoard();
    if (savedBoard) {
      parseJSON(savedBoard);
      let board = (new Board(savedBoard.board, savedBoard.pieceStands)).copy();
      props.board.set(board)
    }
    else {
      console.log(savedBoard);
      console.log("is not a valid board object");
    }
  }

  return (
    <div 
      id="storage-box"
      style={{display: 'flex'}}
    >
      <button 
        id="load-btn"
        onClick={() => load_board()}
      >
      Load Board
      </button>

      <button
        id="save-btn"
        onClick={() => save_board()}
      >
      Save Board
      </button>
    </div>
  );
}