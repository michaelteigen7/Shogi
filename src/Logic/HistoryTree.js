import {emptySquare} from "./Game";

function hash_board(board) {
  const stripPiece = cell => {
    delete cell.strRep;
    delete cell.promoStrRep;
    delete cell.possibleMoveIndices;
    delete cell.isRanged;
    cell.pieceType = cell.getPieceType();
  }
  
  const boardCopy = board.copy()
  // strip board pieces of non-unqiue properties
  for (let row of boardCopy.board) {
    for (let cell of row) {
      if (cell !== emptySquare) {
        stripPiece(cell);
      }
    }
  }

  for (let color in boardCopy.pieceStands) {
    for (let pieceType in boardCopy.pieceStands[color]) {
      boardCopy[color][pieceType].forEach(piece => stripPiece(piece));
    }
  }

  console.log(JSON.stringify(boardCopy));
  return btoa(JSON.stringify(boardCopy));
}

export {hash_board};

class HistoryNode {
  constructor() {
    this.board = [];
    this.parentHash = ''
    this.childHashes = []
  }
}

class HistoryTree {
  constructor() {
    this.tree = {};
    this.moveNum = 0;
  }
}