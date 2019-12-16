import { Pawn, Silver, Gold, King } from "./Pieces";
import { Bishop, Rook, Lance, Knight } from "./RangedPieces";

const emptySquare = " ";
const startBoard = [
  [
    new Lance(false),
    new Knight(false),
    new Silver(false),
    new Gold(false),
    new King(false),
    new Gold(false),
    new Silver(false),
    new Knight(false),
    new Lance(false)
  ],
  [
    emptySquare,
    new Rook(false),
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    new Bishop(false),
    emptySquare
  ],
  [
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false)
  ],
  [
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare
  ],
  [
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare
  ],
  [
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare
  ],
  [
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true)
  ],
  [
    emptySquare,
    new Bishop(true),
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    new Rook(true),
    emptySquare
  ],
  [
    new Lance(true),
    new Knight(true),
    new Silver(true),
    new Gold(true),
    new King(true),
    new Gold(true),
    new Silver(true),
    new Knight(true),
    new Lance(true)
  ]
];

export { emptySquare, startBoard };

const pieceStandList = () => ({
  Pawn: [],
  Knight: [],
  Lance: [],
  Silver: [],
  Gold: [],
  Bishop: [],
  Rook: []
});

const emptyPieceStands = {
  black: pieceStandList(),
  white: pieceStandList()
};

class Board {
  constructor(board, pieceStands = emptyPieceStands) {
    this.board = board;
    this.pieceStands = pieceStands;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = this.board[i][j];
        if (piece !== emptySquare) {
          piece.position = [i, j];
        }
      }
    }
  }

  getEmptySquares() {
    const emptySquares = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === emptySquare) {
          emptySquares.push([i, j]);
        }
      }
    }
    return emptySquares;
  }

  print() {
    for (let row of this.board) {
      console.log("| " + row.join(" | ") + " |");
    }
  }
}

export default Board;
